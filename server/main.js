import { Meteor } from 'meteor/meteor';
import {WebApp} from 'meteor/webapp';
import ConnectRoute from 'connect-route';
import {Links} from '../imports/collections/links';

Meteor.startup(() => {
	//make sure to remove the autopublish from meteor
  Meteor.publish('links', function(){
  	return Links.find({});
  })
});

//executed when user visits a route like localhost:3000/abcd
function onRoute(req,res,next){
	//take the token out of url and try to find it in our links collection
	const link = Links.findOne({token: req.params.token});

	if(link){
	//if found redirect user to the long URL 
	Links.update(link, {$inc: {clicks: 1}});
	res.writeHead(307,{'Location': link.url});
	res.end();
	}else{
	//otherwise send user to normal react app
	next();
	}
}

const middleware = ConnectRoute(function(router){
	router.get('/:token', onRoute);
});

WebApp.connectHandlers.use(middleware);