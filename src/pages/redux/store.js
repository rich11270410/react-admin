//redux最核心的管理对象:store

import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'

import redux from './reducer'