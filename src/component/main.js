let React = require('react');
let ReactDOM = require('react-dom');

var Button =require('antd').Button
//import { Button } from 'antd';

var a =require("./a");

ReactDOM.render(
	<h1>
	Hello, world!
	  <Button type="primary" icon="step-backward">Primary</Button>

	</h1>,
	document.getElementById('example')
);


