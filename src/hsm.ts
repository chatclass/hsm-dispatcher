//TODO: Encapsulate HSM creation to make new HSM register easier
class Component {
  type: "button" | "text";
  sub_type?: "quick_reply";
  index?: "0";
  parameters?: {
    type: "payload",
    payload: string,
  }[];
}

class HSM {
 wa_id: string;
  type: string;
  template: {
    namespace: string;
    name: string;
    language: {
      policy: 'deterministic',
      code: 'pt_BR'
    }
    components: Component[]
  }
}


export function hsm(
  var1: string,
  var2: string,
  var3: string,
  var4 = ""
) {
  return {
    course_start: (phone: number) => ({
      wa_id: phone,
      type: "template",
      template: {
        namespace: "be6c0a9e_147a_4bdc_981f_141f10fe4d80",
        name: "course_start",
        language: {
          policy: "deterministic",
          code: "pt_BR",
        },
        components: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: var1,
              },
              {
                type: "text",
                text: var2,
              },
              {
                type: "text",
                text: var3,
              },
            ],
          },
          {
            type: "button",
            sub_type: "quick_reply",
            index: "0",
            parameters: [
              {
                type: "payload",
                payload: var4,
              },
            ],
          },
        ],
      },
    }),
    activity_reminder: (phone: number) => ({
      wa_id: phone,
      type: "template",
      template: {
        namespace: "c2b73b20_1ea1_4044_bea8_49cb50712de1",
        name: "activity_reminder",
        language: {
          policy: "deterministic",
          code: "pt_BR",
        },
        components: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: var1,
              },
              {
                type: "text",
                text: var2,
              },
              {
                type: "text",
                text: var3,
              },
            ],
          },
        ],
      },
    }),
    activity_reminder_phomenta: (phone: number) => ({
      wa_id: phone,
      type: "template",
      template: {
        namespace: "be6c0a9e_147a_4bdc_981f_141f10fe4d80",
        name: "activity_reminder",
        language: {
          policy: "deterministic",
          code: "pt_BR",
        },
        components: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: var1,
              },
              {
                type: "text",
                text: var2,
              },
              {
                type: "text",
                text: var3,
              },
            ],
          },
        ],
      },
    }),
  };
}
