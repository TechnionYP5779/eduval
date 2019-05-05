export const IOT_CONFIG = {
  domain: 'https://qh6vsuof2f.execute-api.eu-central-1.amazonaws.com/dev/iot/keys',
  iotTopic: (courseId) => {return 'lesson/' + courseId + '/present';},
  xApiKey: "BXGK1t57pTgLKxmReo869MWY2qQey4U4n7fsHjii"
}
