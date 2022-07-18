function formatCourseIds(courseIds: string[]){
  return courseIds.map((id, index) => { return index + 1 === courseIds.length ? `'${id}'` : `'${id}',`})
}
function formatInativityDaysIds(inactivityDays: number[]){
	console.log(inactivityDays)
  const result = inactivityDays.map((id: number, index: number) => { return index + 1 === inactivityDays.length ? `${id}` : `${id},`})
	console.log(result);
	return result.join('');
}

export default function userBaseQuery(
  courseIds: string[],
  onboardingStatus: 'ONBOARDED' | 'NOT_ONBOARDED' = 'ONBOARDED',
  inactivityDays: any = [1,2]
){
const u = `
with course_info AS (
	SELECT 
			row_number() over(order by module_numeric_id,unit_numeric_id,item_numeric_id,todo_numeric_id) AS activity_order,
			module_name,
			module_id,
			unit_id,
			unit_name,
			item_title,
			activity_id
	FROM  course_content_with_block_activities_new
	WHERE course_id in (${formatCourseIds(courseIds)})
	ORDER BY module_numeric_id,unit_numeric_id,item_numeric_id,todo_numeric_id
)

,usr_filtrd as ( 
	select  
							u.id as user_id,
							u.name,
							cl.course_id,
							concat(cl.course_id,'-',u.id) as concat_course_user,
							u.instance_name,
							w.classroom_code as classcode,
							u.whatsapp_id,
							u.created_at as user_creation_date,
							min(s.started_at) as first_interaction,
							max(s.started_at) as last_interaction,
							count(distinct activity_id) as user_activities_done
	from        user_data as u
	left join   web_user_data as w on u.id = w.id 
	inner join  classroom_course as cl on cl.classroom_id = w.classroom_id and cl.classroom_id in (select classroom_id from classroom_course where course_id in (${formatCourseIds(courseIds)}))
	left join   stat as s on u.id = s.user_id and s.course_id in (${formatCourseIds(courseIds)}) and s.activity_id in (select activity_id from course_info)
	where  w.id <> 'deleted_user'
	and w.whatsapp_id not in (
					'5527981191119','5511965232598','5511999069494',
					'5589988149023','5522999445561','5521994633606',
					'5511951333281','5511972972331','556799287331',
					'5527997783037','5511997474870','5527996002253',
					'5511994667220','5514981106678','5515997272571',
					'5511972972331','556799287331','5511993958535',
					'19175769740','558988149023','553197451851','553198935312','5511997579384')
	group by    u.id,u.name,concat_course_user,u.whatsapp_id,u.instance_name,w.classroom_code,user_creation_date,cl.course_id
						)
						
,usr_content as (
								select      u.user_id, u.name, u.course_id, u.concat_course_user, u.instance_name, u.classcode,u.whatsapp_id, u.user_creation_date, u.user_activities_done
														,case when u.first_interaction is null then  'NOT_ONBOARDED' else 'ONBOARDED' end as onboarding_status
														,coalesce(first_interaction, user_creation_date) as first_interaction_date
														,coalesce(last_interaction, user_creation_date) as last_interaction_date
														,c.course_total_activities
								from        usr_filtrd      as u
								left join   (   select      course_id, count(distinct activity_id) as course_total_activities 
																from        course_content_with_block_activities 
																where       course_id in (${formatCourseIds(courseIds)})
																group by    course_id 
														) as c  on c.course_id = u.course_id
						)
						
,final_base as (
		select      f.*, c.activity_id, c.module_id, c.module_name, c.unit_id, c.unit_name, c.item_title,
								coalesce(   case when course_total_activities = user_activities_done then 'Finished' else null end,
														case when date_trunc('day', last_interaction_date) = current_date then 'Active' else 'Churn' end
												) as state
		from        usr_content as f 
		left join   course_info as c on c.activity_order = f.user_activities_done
)


,fb as (
select      whatsapp_id, instance_name, course_id,classcode,state, onboarding_status, 
						date(last_interaction_date) as start_date, date(current_date) as end_date
from        final_base
)

,business_days as (
select  * , 
				((end_date - start_date) - 
					EXTRACT (isodow FROM end_date) + 
					EXTRACT (isodow FROM start_date)) * 5 / 7 + 
				least(EXTRACT (isodow FROM end_date),5) + 5 - 
				2 * least(EXTRACT (isodow FROM start_date),5) thediff
from fb)

select 
						whatsapp_id,
						instance_name,
						course_id,
						classcode,
						start_date,
						onboarding_status,
						thediff
from business_days  
where state <> 'Finished' 
and onboarding_status in (${onboardingStatus})
and thediff in (${formatInativityDaysIds(inactivityDays)})
`
return u
}
