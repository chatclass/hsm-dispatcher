import { Config } from './config';

class Component {
   type: "button" | "text";
  text?: string;
   sub_type?: "quick_reply";
   index?: "0";
   parameters?: {
     type: "payload",
     payload: string,
   }[];
  static text(): Component {
    return new Component()
  }
  static button(): Component {
    return new Component()
  }
 }

 class HSM {
  config: {
    baseURL: string;
    headers: any;
  };
   wa_id?: string;
   type = "template";
   template: {
      namespace: string;
      name: string;
       language: {
         policy: 'deterministic',
         code: 'pt_BR'
       }
      components: Component[]
  }
  constructor(input: {
    id: string;
    namespace: string;
    name: string;
    vars: number;
    buttons: number;
    config: {
      baseURL: string;
      headers: any;
    }
  }){
    this.template.namespace = input.namespace,
    this.template.name = input.name;
    this.config = input.config; 
    this.template.components = [ 
      ...Array.from(Array(input.vars)).map(() => {
        return Component.text()
      }),
      ...Array.from(Array(input.buttons)).map(() => {
        return Component.button()
      })
    ]
  }
}

export function GetHSM(){
  const hsms = [
    new HSM({
      id: 'course_start',
      name: 'course_start',
      config: {
        baseURL: 'https://waba.360dialog.io/v1',
        headers: { 'D360-API-KEY' : Config.whatsapp.phomenta.key },
      },
      namespace: "be6c0a9e_147a_4bdc_981f_141f10fe4d80",
      vars: 3,
      buttons: 1
    }),
  ]
}

export function hsm(
  var1: string,
  var2: string,
  var3: string,
  var4 = ""
) {
  return {
    course_start: {
      name: 'course_start',
			config: {
				baseURL: 'https://waba.360dialog.io/v1',
				headers: { 'D360-API-KEY' : Config.whatsapp.phomenta.key },
			},
      build: (phone: number) => ({
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
    },
		course_start_nine_nine: {
      name: 'course_start',
			config: {
				baseURL: 'https://graph.facebook.com/v12.0/105880862155846',
				headers: { 'Authorization' : Config.whatsapp.ninenine.key },
			},
      build: (phone: number) => ({
        to: phone,
        type: "template",
				"messaging_product": "whatsapp",
        template: {
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
    },
    activity_reminder: {
      name: 'activity_reminder',
			config: {
				baseURL: 'https://graph.facebook.com/v12.0/105880862155846',
				headers: { 'Authorization' : Config.whatsapp.ninenine.key },
			},
      build: (phone: number) => ({
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
    },
		activity_reminder_cultura: {
      name: 'activity_reminder',
			config: {
				baseURL: 'https://waba.360dialog.io/v1',
				headers: { 'D360-API-KEY' : Config.whatsapp.cultura.key },
			},
      build: (phone: number) => ({
        to: phone,
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
    },
		activity_reminder_gsh: {
      name: 'activity_reminder',
			config: {
				baseURL: 'https://graph.facebook.com/v12.0/2783566445047226',
				headers: { 'Authorization' : Config.whatsapp.gsh.key },
			},
      build: (phone: number) => ({
        to: phone,
        type: "template",
				"messaging_product": "whatsapp",
        template: {
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
    },
		activity_reminder_nine_nine: {
      name: 'activity_reminder',
			config: {
				baseURL: 'https://graph.facebook.com/v12.0/105880862155846',
				headers: { 'Authorization' : Config.whatsapp.ninenine.key },
			},
      build: (phone: number) => ({
        to: phone,
        type: "template",
				"messaging_product": "whatsapp",
        template: {
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
    },
    activity_reminder_phomenta: {
      name: 'activity_reminder_phomenta',
			config: {
				baseURL: 'https://waba.360dialog.io/v1',
				headers: { 'D360-API-KEY' : Config.whatsapp.phomenta.key },
			},
      build: (phone: number) => ({
        to: phone,
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
    },
    activity_reminder_bei: {
      name: 'activity_reminder_bei',
			config: {
        baseURL: 'https://waba.360dialog.io/v1',
				headers: { 'D360-API-KEY' : Config.whatsapp.beieditora.key },
			},
      build: (phone: number) => ({
        to: phone,
        type: "template",
        template: {
          namespace: "5e66109c_b0b8_4ac2_b86f_bd9f6db2fbf6",
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
    },
    bei_editora: {
      name: 'bei_editora',
			config: {
				baseURL: 'https://waba.360dialog.io/v1',
				headers: { 'D360-API-KEY' : Config.whatsapp.beieditora.key },
			},
      build: (phone: number) => ({
        to: phone,
        type: 'template',
        template: {
          namespace: '5e66109c_b0b8_4ac2_b86f_bd9f6db2fbf6',
          name: 'onboard_new_user_beta4',
          language: {
            policy: 'deterministic',
            code: 'pt_BR',
          },
          components: [
            {
              type: 'body',
              parameters: [
                {
                  type: 'text',
                  text: 'a Beĩ Renda Familiar',
                },
                {
                  type: 'text',
                  text: 'para fazer o curso *Como organizar a renda familiar para viver melhor*',
                },
              ],
            },
            {
              type: 'button',
              sub_type: 'quick_reply',
              index: '0',
              parameters: [
                {
                  type: 'payload',
                  payload: var4,
                },
              ],
            },
          ],
        },
      })
    },
    course_start_bei: {
      name: 'course_start',
      config: {
        baseURL: 'https://waba.360dialog.io/v1',
        headers: { 'D360-API-KEY' : Config.whatsapp.beieditora.key },
      },
      build: (phone: number) => ({
        to: phone,
        type: "template",
        template: {
          namespace: '5e66109c_b0b8_4ac2_b86f_bd9f6db2fbf6',
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
    }
  }
}
