import chalk from 'chalk'
import { getClient } from '../client'
import { daturlOpt, daturlToKey } from '../opts'
import { niceUrl } from '../strings'

export default {
  name: 'unhost',
  command: async function (args) {
    var rpc = getClient()
    var daturl = daturlOpt(args._[0])

    if (!daturl) {
      if (!args._[0]) throw new Error('Dat URL is required')
      else throw new Error(`'${args._[0]}' is not a valid dat url`)
    }

    // run command
    var datkey = daturlToKey(daturl)
    await rpc.setArchiveUserSettings(datkey, { isHosting: false })
    console.log(`\nOk. ${niceUrl(daturl, true)} is ${chalk.red('unhosted')}.\n`)
  }
}
