import React from 'react'
import {connect} from 'react-redux'
import {signInChange, signIn} from '../redux/action-creators'

function mapStateToProps (state){
  return {...state.signInForm}
}

function mapDispatchToProps(dispatch){
  return {
    signInChange: (...args) => dispatch(signInChange(...args)),
    signIn: (...args) => dispatch(signIn(...args)),
  }
}

function Login (props) {
  return (
  <div className='box'>
    <div className='box-header-timeline'>
      Hello
    </div>
    <div className='box-body'>
      <div className='col-md-12'>
        <h2 className='p-signin-header'>Sign in</h2>
        <div className='row'>
          <div className='col-md-6'>
            <form onSubmit={(e) => props.signIn(props.login, props.password)} className='p-signin'>
              <div className='form-group'>
                <label htmlFor='username'>Username</label>
                <input id='username' className='ember-view ember-text-field form-control' type='text' onChange={e => props.signInChange(e.target.value)}/>
              </div>
              <div className='form-group'>
                <label htmlFor='password'>Password</label>
                <input id='password' className='ember-view ember-text-field form-control' type='password' onChange={e => props.signInChange(undefined, e.target.value)}/>
              </div>
              <div className='form-group'>
                <button className='btn btn-default p-singin-action' type='submit'>Sign in</button>
              </div>
            </form>
            <p>New to freefeed? <a href='https://docs.google.com/forms/d/1P4cyYUZlxABbWvZrM5jHRcMUFQFpc8qfbZWjGulobsA/viewform?c=0&amp;w=1' target='_blank'>Create an account »</a></p>
          </div>
        </div>
      </div>
    </div>
    <div className='box-footer'>
    </div>
  </div>
)}

export default connect(mapStateToProps, mapDispatchToProps)(Login)