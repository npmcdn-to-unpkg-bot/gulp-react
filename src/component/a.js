

let React = require('react');
let ReactDOM = require('react-dom');

var CommentBox=React.createClass({
	comments:[
		{
			title:'不错，超级满意',
			content:'样子漂亮，买之前还在担心有什么问题，是我多想了，很实用，很好'
		},
		{
			title:'还不错',
			content:'送人的礼物，很满意的购物'
		}
	],
	render:function(){
		return (
			<div className="commentBox">
				<h1>iPad mini 3的评论</h1>
				<CommentList data={this.comments}/>
			</div>
		);
	}
});




exports.a=CommentBox