import adapt from 'probot-actions-adapter'
import { ApplicationFunction } from 'probot'
import * as probot from './index'

adapt(probot as ApplicationFunction);
