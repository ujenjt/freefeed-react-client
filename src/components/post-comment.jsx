import React from 'react';
import ReactDOM from 'react-dom';
import Textarea from 'react-textarea-autosize';
import _ from 'lodash';
import classnames from 'classnames';

import PieceOfText from './piece-of-text';
import UserName from './user-name';
import {preventDefault, confirmFirst, fromNowOrNow} from '../utils';
import throbber16 from 'assets/images/throbber-16.gif';

export default class PostComment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editText: this.props.editText || ''
    };
  }

  handleChange = (event) => {
    this.setState({
      editText: event.target.value
    });
  }

  openAnsweringComment = (event) => {
    event.preventDefault();
    if (this.props.openAnsweringComment && event.button === 0) {
      const answerText = (event.ctrlKey || event.metaKey) ? _.repeat('^', this.props.backwardNumber) : '@' + this.props.user.username;
      this.props.openAnsweringComment(answerText);
    }
  }

  setCaretToTextEnd = (event) => {
    const input = event.target;

    setTimeout(() => {
      if (typeof input.selectionStart === 'number') {
        input.selectionStart = input.selectionEnd = input.value.length;
      } else if (input.createTextRange !== undefined) {
        input.focus();
        const range = input.createTextRange();
        range.collapse(false);
        range.select();
      }
    }, 0);
  }

  updateCommentingText = () => {
    if (this.props.updateCommentingText) {
      this.props.updateCommentingText(this.props.id, this.refs.commentText.value);
    }
  }

  checkSave = (event) => {
    const isEnter = event.keyCode === 13;
    const isShiftPressed = event.shiftKey;
    if (isEnter && !isShiftPressed) {
      event.preventDefault();
      event.target.blur();
      setTimeout(this.saveComment, 0);
    }
  }

  saveComment = () => {
    if (!this.props.isSaving) {
      this.props.saveEditingComment(this.props.id, this.refs.commentText.value);
    }
  }

  componentWillReceiveProps(newProps) {
    const wasCommentJustSaved = this.props.isSaving && !newProps.isSaving;
    const wasThereNoError = !newProps.errorString;
    const isItSinglePostAddingComment = newProps.isSinglePost;
    const shouldClearText = (wasCommentJustSaved && wasThereNoError && isItSinglePostAddingComment);
    if (shouldClearText) {
      this.setState({editText: ''});
    }
    if (this.props.editText !== newProps.editText) {
      this.setState({editText: newProps.editText});
    }
  }
  
  componentDidUpdate(prevProps) {
    if (this.props.isEditing && this.props.editText !== prevProps.editText) {
      ReactDOM.findDOMNode(this.refs.commentText).focus();
    }
  }

  render() {
    const createdAgo = fromNowOrNow(+this.props.createdAt);
    const className = classnames({
      'comment': true,
      'highlighted': this.props.highlighted,
      'omit-bubble': this.props.omitBubble
    });

    return (
    <div className={className} data-author={this.props.isEditing ? '' : this.props.user.username}>
      <a className={`comment-icon fa ${this.props.omitBubble ? 'feed-comment-dot' : 'fa-comment-o'}`}
         title={createdAgo}
         id={`comment-${this.props.id}`}
         href={`${this.props.entryUrl}#comment-${this.props.id}`}
         onClick={this.openAnsweringComment}></a>
      {this.props.isEditing ? (
        <div className="comment-body">
          <div>
            <Textarea
              autoFocus={!this.props.isSinglePost}
              ref="commentText"
              className="comment-textarea"
              value={this.state.editText}
              onFocus={this.setCaretToTextEnd}
              onChange={this.handleChange}
              onKeyDown={this.checkSave}
              onBlur={this.updateCommentingText}
              style={{ overflow: 'hidden', wordWrap: 'break-word' }}
              minRows={2}
              maxRows={10}
              maxLength="1500"/>
          </div>
          {this.props.isSinglePost ? (
            <span>
              <button className="btn btn-default btn-xs comment-post" onClick={this.saveComment}>Comment</button>
            </span>
          ) : (
            <span>
              <button className="btn btn-default btn-xs comment-post" onClick={this.saveComment}>Post</button>
              <a className="comment-cancel" onClick={preventDefault(_=>this.props.toggleEditingComment(this.props.id))}>Cancel</a>
            </span>
          )}
          {this.props.isSaving ? (
            <span className="comment-throbber">
              <img width="16" height="16" src={throbber16}/>
            </span>
          ) : false}
          {this.props.errorString ? (
            <span className="comment-error">{this.props.errorString}</span>
          ) : false}
        </div>
      ) : (
        <div className="comment-body">
          <PieceOfText
            text={this.props.body}
            userHover=  {{hover: username => this.props.highlightComment(username),
                          leave: this.props.clearHighlightComment}}
            arrowHover= {{hover: arrows => this.props.highlightArrowComment(arrows),
                          leave: this.props.clearHighlightComment}}/>
          {' -'}&nbsp;
          <UserName user={this.props.user}/>
          {this.props.isEditable ? (
            <span>
              {' '}(<a onClick={preventDefault(_=>this.props.toggleEditingComment(this.props.id))}>edit</a>
              &nbsp;|&nbsp;
              <a onClick={confirmFirst(_=>this.props.deleteComment(this.props.id))}>delete</a>)
            </span>
          ) : (this.props.isDeletable && this.props.isModeratingComments) ? (
            <span>
              {' '}(<a onClick={confirmFirst(_=>this.props.deleteComment(this.props.id))}>delete</a>)
            </span>
          ) : false}
        </div>
      )}
    </div>
  );}
}
