export const getRewards = async (store) => {
  let result = ['No rewards available']
  if (store) {
    await store.subscribe((mutation, state) => {
      let rewards = state.bot.currentBot.rewards
      let rewardTitles
      if (rewards) {
        rewardTitles = rewards.map((reward) => reward.name)
        result = rewardTitles
      }
    })
  }
  return result
}

export function skillMenu() {
  return [
    {
      title: 'Custom Skill',
    },
    {
      title: '🥇 Check Points',
    },
    {
      title: '👩‍🎓 Advanced Group',
    },
    {
      title: '🔗 Your referral link',
    },
    {
      title: '🎁 Rewards',
    },
  ]
}
export function actionMenu() {
  return [
    {
      title: 'Send Message',
      icon: 'mdi-message-settings',
      items: [
        {
          title: 'Text Messages',
          icon: 'mdi-message',
        },
        {
          title: 'Images',
          icon: 'mdi-image',
        },
        {
          title: 'Documents',
          icon: 'mdi-file',
        },
      ],
    },
    {
      title: 'Quick Reply',
      icon: 'mdi-android-messages',
      items: [
        {
          title: 'Phone',
          icon: 'mdi-mobile',
        },
        {
          title: 'Email',
          icon: 'mdi-email',
        },
        {
          title: 'Location',
          icon: 'mdi-map-marker',
        },
      ],
    },
    {
      title: 'Show Reward',
      icon: 'mdi-folder-multiple-image',
      items: [],
    },
  ]
}
