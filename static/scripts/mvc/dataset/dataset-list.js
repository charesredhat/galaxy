define(["mvc/list/list-panel","mvc/dataset/dataset-li","mvc/base-mvc","utils/localization"],function(a,b,c,d){var e=a.ListPanel,f=e.extend({viewClass:b.DatasetListItemView,className:e.prototype.className+" dataset-list",noneFoundMsg:d("No matching datasets found"),initialize:function(a){e.prototype.initialize.call(this,a)},toString:function(){return"DatasetList("+this.collection+")"}});return{DatasetList:f}});
//# sourceMappingURL=../../../maps/mvc/dataset/dataset-list.js.map