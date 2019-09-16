app.controller('LiuShuiController', function($location, $rootScope, $scope,UserService) {
  
  
  $scope.accounts_obj = UserService.getAccounts();

  $scope.zhongjia = 0;
  $scope.yongjin = 0;
  $scope.show_index = -1;

  var shike_zhanghao = ['洁bv萱莹','michaeljohndok', 'hz2857', '阿罪罪1099001573' ,'墨嫣莹dfh泽' ,'焦玫hk咏', '向慧亮悦玉', '千千商城h', '麻幽b雅萱萍', '广百sd女鞋代', '余丽fh丽乐敏', '汇聚一轩', '你不在qr5'];
  var yinhang_ka = ['其他','麦国权','梁惠珍','梁杰辉','麦碧玉','麦方森',]

  var shike_accounts = [];
  var yinhang_accounts = []; 
  var all_accounts = []; 

  for (var i = 0; i < shike_zhanghao.length; i++) {
    var obj = {};
    obj.name = shike_zhanghao[i];
    obj.yuer = 0;
    obj.type = 'shike';
    shike_accounts.push(obj);
    all_accounts.push(obj);

  }

  for (var i = 0; i < yinhang_ka.length; i++) {
    var obj = {};
    obj.name = yinhang_ka[i];
    obj.yuer = 0;
    obj.type = 'ka';
    yinhang_accounts.push(obj);
    all_accounts.push(obj);
  }



  $scope.all_accounts = all_accounts;


  var match_accounts = UserService.getMatchAccounts();

  $scope.match_accounts = match_accounts;

  var list = [];

  var init_orders = function(){
    $scope.order_page = 1;
    $scope.load_more_end = false;
    $scope.orders = [];
    
    //计算订单输入输出
    var orders = UserService.getLiveOrders();
    orders.then(function(orders){
      console.log(orders);
      console.log(orders[0]);

      var days_count_list = [];
      var list = [];

      for (var i = 0; i < orders.length; i++) {
        var order = orders[i];
        for (var j = 0; j < all_accounts.length; j++) {
          var account = all_accounts[j];

          if (order.get('taobao') == account.name) {
            account.yuer = account.yuer + parseInt(order.get('pingtaifan'));
          }
        }

        for (var j = 0; j < match_accounts.length; j++) {
          var account = match_accounts[j];
          if (order.get('taobao') == account.name) {
            var guishu = account.guishu;

            for (var z = 0; z < all_accounts.length; z++) {
              var ac = all_accounts[z];
              if (ac.name == guishu) {
                ac.yuer = ac.yuer - parseInt(order.get('pingtaifan'));
              }
            }
          }
        }

      }



      //计算修改记录
      var orders = UserService.getLiuShuiOrders();
      orders.then(function(orders){

        for (var i = 0; i < orders.length; i++) {
          var order = orders[i];

          order.shuru = order.get('shuru');
          order.shuchu = order.get('shuchu');
          order.yuer = order.get('yuer');
          order.beizhu = order.get('beizhu');

          var date = new Date(order.get('createdAt'));

          var d = date.getDate();
          var m = date.getMonth() + 1; //Month from 0 to 11
          var y = date.getFullYear();

          var time = y + "-" + m + "-" + d;
          order.time = time;
          
        }



        //计算
        
        for (var i = 0; i < orders.length; i++) {
          var od = orders[i];
          for (var j = 0; j < all_accounts.length; j++) {
            var account = all_accounts[j];

            if (account.name == od.get('shuru')) {
              account.yuer = account.yuer + parseInt(od.get('yuer'));
            }

            if (account.name == od.get('shuchu')) {
              account.yuer = account.yuer - parseInt(od.get('yuer'));
            }
          }
        }

        $scope.orders = orders;

        var total_money = 0;
        var ka_money = 0;
        for (var i = 0; i < all_accounts.length; i++) {
          total_money = total_money + all_accounts[i].yuer ;


          if (all_accounts[i].type == 'ka') {
            ka_money = ka_money + all_accounts[i].yuer ;
          }

        }




        $scope.total_money = total_money;
        $scope.ka_money = ka_money;

      })

    })
  }

  init_orders();

  $scope.showAccounts = function(){
    $scope.show_accounts = !$scope.show_accounts ;
  }

  $scope.showIndex = function(index){

    
    $scope.show_index = index;
  }

  $scope.addOrder = function(){
    var Orders = AV.Object.extend('LiuShui');
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


    order.set('shuru',order.shuru);
    order.set('shuchu',order.shuchu);
    order.set('yuer',order.yuer);
    order.set('beizhu',order.beizhu);



    order.save().then(function(order){
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










