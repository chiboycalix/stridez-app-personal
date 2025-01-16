import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.addLocale(en)
TimeAgo.addDefaultLocale(en)

export const TimeFormatter = (date: any) => {
  const timeAgo = new TimeAgo('en-US')
  return timeAgo.format(date)
}

export default TimeFormatter
