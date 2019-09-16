app.controller('PDDController', function($location, $rootScope, $scope,UserService) {
  

  // if (!$rootScope.user.get('name')) {
  //   $scope.message = {};
  //   $scope.message.body_text = "您的会员信息还没完善，请点击按钮去完善！";
  //   $scope.message.btn_text = "去完善";
  //   $scope.message.type = 'go_to_profile';
  // }
  
  $scope.accounts_obj = UserService.getAccounts();

  $scope.zhongjia = 0;
  $scope.yongjin = 0;
  $scope.show_index = -1;

  

  var init_orders = function(){
    $scope.order_page = 1;
    $scope.load_more_end = false;
    $scope.orders = [];
  
    var orders = UserService.getPDDOrders();
    orders.then(function(orders){
      console.log(orders);
      var zhongjia = 0;
      var yongjin = 0;

      var days_count_list = [];
      var list = [];

      for (var i = 0; i < orders.length; i++) {
        orders[i].pingtai = orders[i].get('pingtai');
        orders[i].username = orders[i].get('username');
        orders[i].address = orders[i].get('address');
        orders[i].diandanhao = orders[i].get('diandanhao');
        orders[i].jiedan_q = orders[i].get('jiedan_q');
        orders[i].shangjia_q = orders[i].get('shangjia_q');
        orders[i].pingyu = orders[i].get('pingyu');
        orders[i].beizhu = orders[i].get('beizhu');
        orders[i].zhuangtai = orders[i].get('zhuangtai');

        orders[i].jiage = orders[i].get('jiage');
        orders[i].pingtaifan = orders[i].get('pingtaifan');
        orders[i].yongjin = orders[i].get('yongjin');
        orders[i].guanjianzi = orders[i].get('guanjianzi');
        orders[i].pinglun = orders[i].get('pinglun');
        orders[i].shangjiaq = orders[i].get('shangjiaq');


        var date = new Date(orders[i].get('createdAt'));

        var d = date.getDate();
        var m = date.getMonth() + 1; //Month from 0 to 11
        var y = date.getFullYear();

        var time = y + "-" + m + "-" + d;
        orders[i].time = time;

      }

      $scope.orders = orders;
    })
  }

  init_orders();

  $scope.showCounting = function(){
    $scope.show_counting = !$scope.show_counting;
  }

  $scope.showIndex = function(index){

    
    $scope.show_index = index;
  }

  $scope.addOrder = function(){
    var Orders = AV.Object.extend('PDD');
    var order = new Orders();
    order.set('creator',$rootScope.user);
    order.save().then(function (order) {
      // console.log(order);
      $scope.$apply(function(){
        $scope.orders.unshift(order);
      })
     
    }, function (error) {
      console.error(error);
    });
  }

  $scope.zhuangTaiClass = function(order){
    var return_class = ""
    if (order.zhuangtai == '拼多多下单') {
      return_class  = 'bg_yellow'; 
    }


    if (order.zhuangtai == '货反') {
      return_class  = 'bg_pink'; 
    }

    if (order.zhuangtai == '完成') {
      return_class  = 'bg_green'; 
    }

    if (order.zhuangtai == '快递到') {
      return_class  = 'bg_orange'; 
    }

    return return_class;
  }

  $scope.deleteOrder = function(order){

    if (order.jiage) {
      alert('有价格数据，不能删除，请先删除价格数据，然后再删除！！！！！')
    }else{
      var index = $scope.orders.indexOf(order);
      if (index > -1) {
        $scope.orders.splice(index, 1);
      }


      order.set('remove',true);
      order.save();
    }

    
  }

  $scope.saveOrder = function(order){
    var taobao = '';
    var sikehao = '';


    order.set('taobao',order.taobao);
    order.set('sikehao',sikehao);


    order.set('pingtai',order.pingtai);
    order.set('username',order.username);
    order.set('address',order.address);

    order.set('yaoqiu',order.yaoqiu);
    order.set('dianpu',order.dianpu);
    order.set('diandanhao',order.diandanhao);
    order.set('jiedan_q',order.jiedan_q);
    order.set('shangjia_q',order.shangjia_q);
    order.set('pingyu',order.pingyu);
    order.set('beizhu',order.beizhu);

    order.set('zhuangtai',order.zhuangtai);

    order.set('jiage',order.jiage);
    order.set('pingtaifan',order.pingtaifan);
    order.set('yongjin',order.yongjin);
    order.set('guanjianzi',order.guanjianzi);
    order.set('pinglun',order.pinglun);
    order.set('shangjiaq',order.shangjiaq);



    order.save().then(function(order){

      console.log(order.toJSON());
      consloe.log(order);
    });
  }

  $scope.msgAction = function(msg){
    $scope.message = false;
    if (msg.type == 'go_to_profile') {
      $location.path("/myprofile" );
    }
  }


  $scope.user_load_more = function(user){
    $scope.user_page ++;
    var users = UserService.getUsers($scope.user_page);
    users.then(function(users){
      for (i = 0; i <= users.length - 1; i++) {
        $scope.users.push(users[i]);
      }

      $scope.load_more_end = false;
      if (!users || !users[19]) {
        $scope.load_more_end = true;
      }
    })
  }

  $scope.triggerProfile = function(user){
    user.show = !user.show;
  }

  $scope.search = function(){
    init_orders();
  }

});










