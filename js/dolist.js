angular.module("myapp",[]).controller("dolist",["$scope","$filter",function ($scope,$filter) {
    // angularjs 单页面应用，对于数据的增删改查比较频繁的应用当中
    // 双向数据绑定 视图中有体现，在数据里面也有
    // 元数据
    $scope.data=localStorage.data?JSON.parse(localStorage.data):[];
    // 完成的数据
    $scope.done=localStorage.done?JSON.parse(localStorage.done):[];
    // 是否显示完成列表
    $scope.isshow=true;

    // 当前选择的事项
    $scope.currentIndex=0;
    $scope.currentCon=$scope.data[$scope.currentIndex];

    // 监控search
    $scope.search="";
    $scope.$watch("search",function (news) {
        var arr=$filter("filter")($scope.data,{title:$scope.search});
        $scope.currentIndex=0;
        $scope.currentCon=arr[$scope.currentIndex];
    });

    // 添加列表
    $scope.add=function () {
        var obj={};
        obj.id=getMaxId($scope.data);
        obj.title="新建事项"+obj.id;
        obj.son=[];
        $scope.data.push(obj);
        $scope.currentIndex=getIndex($scope.data,obj.id);
        $scope.currentCon=$scope.data[$scope.currentIndex];
        localStorage.data=JSON.stringify($scope.data);
    };
    // 保证数据的唯一性，id唯一 增加每条数据 id+1 （加项目的时候让最大的id+1成为新添加项目的id）
    function getMaxId(arr) {
        if(arr.length==0){
            return 1;
        }else{
            var temp=arr[0].id;
            for(var  i=0;i<arr.length;i++){
                if(arr[i].id>temp){
                    temp=arr[i].id;
                }
            }
            return temp+1;
        }
    }
    // 删除
    $scope.removeList=function (id) {
        angular.forEach($scope.data,function (obj,index) {
            if(id==obj.id){
                var index=getIndex($scope.data,id);
                $scope.data.splice(index,1);
                if(index==$scope.data.length-1){
                    $scope.currentIndex=index;
                    $scope.currentCon=$scope.data[$scope.currentIndex];
                }else{
                    $scope.currentIndex=$scope.data.length-1;
                    $scope.currentCon=$scope.data[$scope.currentIndex];
                }
            }
        });
        localStorage.data=JSON.stringify($scope.data);
    };
    // 列表获得焦点
    $scope.focus=function (id) {
      var index=getIndex($scope.data,id);
      $scope.currentIndex=index;
      $scope.currentCon=$scope.data[$scope.currentIndex];
    };
    // 列表失去焦点  把改变的数据存储到本地 localStorage.data只支持字符串
    $scope.blur=function (id) {
        localStorage.data=JSON.stringify($scope.data);
    };
    // 当前条目的下标
    function getIndex(arr,id) {
        for(var  i=0;i<arr.length;i++){
            if(arr[i].id==id){
                return i;
            }
        }
    }
    // 添加条目
    $scope.addOpt=function () {
        var obj={};
        var id=getMaxId($scope.currentCon.son);
        obj.id=id;
        obj.title="新建条目"+obj.id;
        $scope.currentCon.son.push(obj);
        localStorage.data=JSON.stringify($scope.data);
    };
    // 删除条目
    $scope.delOpt=function (id) {
        var index=getIndex($scope.currentCon.son,id);
        $scope.currentCon.son.splice(index,1);
        localStorage.data=JSON.stringify($scope.data);
    };
    // 完成条目
    $scope.doneFun=function (id) {
        var index=getIndex($scope.currentCon.son,id);
        // 原数组删除
        var obj=$scope.currentCon.son.splice(index,1);
        // 要将删除的元素放到done数组里面
        obj[0].id=getMaxId($scope.done);
        $scope.done.push(obj[0]);
        localStorage.data=JSON.stringify($scope.data);
        localStorage.done=JSON.stringify($scope.done);
    };

    // 显示完成列表
    $scope.showdone=function () {
        $scope.isshow=false;
    };
    // 显示项目列表
    $scope.showlist=function () {
        $scope.isshow=true;
    };
    // 删除已完成条目
    $scope.removeDone=function (id) {
        var index=getIndex($scope.done,id);
        $scope.done.splice(index,1);
        localStorage.done=JSON.stringify($scope.done);
    }

}]);