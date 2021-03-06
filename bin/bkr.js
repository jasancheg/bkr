#!/usr/bin/env node

import subcommand from 'subcommand'
import chalk from 'chalk'

import initCmd from '../lib/commands/init'
import coCmd from '../lib/commands/co'
import forkCmd from '../lib/commands/fork'
import statusCmd from '../lib/commands/status'
import pullCmd from '../lib/commands/pull'
import publishCmd from '../lib/commands/publish'
import devCmd from '../lib/commands/dev'
import lsCmd from '../lib/commands/ls'
import addCmd from '../lib/commands/add'
import rmCmd from '../lib/commands/rm'
import hostCmd from '../lib/commands/host'
import unhostCmd from '../lib/commands/unhost'

import * as errorHandler from '../lib/error-handler'
import usage from '../lib/usage'
import { getClient } from '../lib/client'

const VERSION = 1

// main
// =

var commands = [
  initCmd,
  coCmd,
  forkCmd,
  statusCmd,
  pullCmd,
  publishCmd,
  devCmd,
  lsCmd,
  addCmd,
  rmCmd,
  hostCmd,
  unhostCmd
].map(wrapCommand)

// match & run the command
var match = subcommand({ commands, none })
match(process.argv.slice(2))

// adds a handshake before each command, and nice error output
function wrapCommand (obj) {
  var innerCommand = obj.command

  obj.command = async function (...args) {
    try {
      await getClient().hello(VERSION)
      await innerCommand(...args)
    } catch (err) {
      if (err.code === 'ECONNREFUSED') {
        out('Error: Could not connect to Beaker. Is it running?')
      } else {
        // generic output
        out(err)
      }
      process.exit(1)
    }
  }

  function out (...args) {
    console.error(chalk.bold.red(...args))  
  }
  return obj
}

// error output when no/invalid command is given
function none (args) {
  var err = (args._[0]) ? `Invalid command: ${args._[0]}` : false
  usage(err)
}