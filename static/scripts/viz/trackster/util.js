define(function(){var a=function(a){return"promise"in a},b=Backbone.Model.extend({defaults:{ajax_settings:{},interval:1e3,success_fn:function(){return!0}},go:function(){var a=$.Deferred(),b=this,c=b.get("ajax_settings"),d=b.get("success_fn"),e=b.get("interval"),f=function(){$.ajax(c).success(function(b){d(b)?a.resolve(b):setTimeout(f,e)})};return f(),a}}),c=function(a){a||(a="#ffffff"),"string"==typeof a&&(a=[a]);for(var b=0;b<a.length;b++)a[b]=parseInt(a[b].slice(1),16);var c,d,e,f,g,h,i,j,k,l,m,n=function(a,b,c){return(299*a+587*b+114*c)/1e3},o=function(a,b,c,d,e,f){return Math.max(a,d)-Math.min(a,d)+(Math.max(b,e)-Math.min(b,e))+(Math.max(c,f)-Math.min(c,f))},p=!1,q=0;do{for(c=Math.round(16777215*Math.random()),d=(16711680&c)>>16,e=(65280&c)>>8,f=255&c,k=n(d,e,f),p=!0,b=0;b<a.length;b++)if(g=a[b],h=(16711680&g)>>16,i=(65280&g)>>8,j=255&g,l=n(h,i,j),m=o(d,e,f,h,i,j),Math.abs(k-l)<40||200>m){p=!1;break}q++}while(!p&&10>=q);return"#"+(16777216+c).toString(16).substr(1,6)};return{is_deferred:a,ServerStateDeferred:b,get_random_color:c}});
//# sourceMappingURL=../../../maps/viz/trackster/util.js.map