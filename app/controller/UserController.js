app.controller('UserListController', function($location, $rootScope, $scope,UserService) {
  

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

  $scope.show_list = true;
  

  var init_orders = function(){
    $scope.order_page = 1;
    $scope.load_more_end = false;
    $scope.orders = [];
  
    var orders = UserService.getNotFinishOrders($scope.search_limit,$scope.search_word);
    orders.then(function(orders){
      var zhongjia = 0;
      var yongjin = 0;

      var days_count_list = [];
      var list = [];

      for (var i = 0; i < orders.length; i++) {
        orders[i].taobao = orders[i].get('taobao');
        orders[i].yaoqiu = orders[i].get('yaoqiu');
        orders[i].dianpu = orders[i].get('dianpu');
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
        var h = date.getHours();
        var min = date.getMinutes();

        var time = y + "-" + m + "-" + d;

        var time2 = h + ":" + min;
        orders[i].time = time;
        orders[i].time2 = time2;
        orders[i].hour = h;

        

        zhongjia = zhongjia + parseInt(orders[i].jiage);
        yongjin = yongjin + parseInt(orders[i].yongjin);

        var obj = days_count_list[time];
        if (!obj) {
          var obj = {};
          obj.time = time;
          obj.zhongjia = 0;
          obj.yongjin = 0;
          obj.taobaos = [];
          obj.begin_time = orders[i].get('createdAt');
          obj.end_time = orders[i].get('createdAt');
          obj.begin_hour = orders[i].hour;
          obj.end_hour = orders[i].hour;


          days_count_list[time] = obj;

          list.push(time);
        }

        var obj = days_count_list[time];

        obj.zhongjia = obj.zhongjia + parseInt(orders[i].jiage);
        obj.yongjin = obj.yongjin + parseInt(orders[i].yongjin);
        obj.last_id = i;

        if (obj.begin_hour > orders[i].hour) {
          obj.begin_time = orders[i].get('createdAt') ;
        }

        if (obj.end_hour < orders[i].hour) {
          obj.end_time = orders[i].get('createdAt');
        }

        obj.word_hour = UserService.countTime(obj.end_time,obj.begin_time);

        var index = obj.taobaos.indexOf(orders[i].taobao);
        if (index < 0) {
          obj.taobaos.push(orders[i].taobao);
        }

        

      }

      $scope.zhongjia = zhongjia;
      $scope.yongjin = yongjin;
      $scope.orders = orders;
      $scope.days_count_list = days_count_list;
      $scope.list = list;
      if (!orders || !orders[19]) {
        $scope.load_more_end = true;
      }
    })
  }

  init_orders();


  $scope.checkShuaClass = function(account){
    // console.log(account);

    if (account.jiange) {
      if (account.jiange.days > 10) {
        return 'bg_green';
      }else if(account.jiange.days >= 6){
        return 'bg_yellow'
      }
    }
    
  }

  $scope.showList = function(){
    $scope.show_list = true;
    $scope.show_counting  = false;
    $scope.match_accounts = false;

  }

  $scope.showZhangHao = function(){
    var match_accounts = UserService.getMatchAccounts();
    $scope.match_accounts = match_accounts;
    $scope.show_zhanghao = !$scope.show_zhanghao;
    $scope.show_list = false;
    $scope.show_counting  = false;


    //统计账号
    var orders = UserService.getNotFinishOrders(200);
    orders.then(function(orders){
      for (var i = 0; i < match_accounts.length; i++) {
        

        

        var account = match_accounts[i];


        for (var j = 0; j < orders.length; j++) {
          var order = orders[j];

          if (order.get('taobao') == account.name) {
            if (!account.last_time) {
              account.last_time = order.get('createdAt');
            }


            orderTime= new Date(Date.parse(order.get('createdAt')));
            accountTime=new Date(Date.parse(account.last_time));
            

            if (orderTime>accountTime) {
              account.last_time = order.get('createdAt');

            }

          }
        }

      }

      for (var i = 0; i < match_accounts.length; i++) {
        var account = match_accounts[i];
        var end_time = new Date(); // 结束时间
        var begin_time = account.last_time; // 结束时间
        account.jiange = UserService.countTime(end_time,begin_time);


        var date = new Date(account.last_time );

        var d = date.getDate();
        var m = date.getMonth() + 1; //Month from 0 to 11
        var y = date.getFullYear();
        var time = y + "-" + m + "-" + d;

        account.last_day = time;

      }

    })

  }

  $scope.showCounting = function(){
    $scope.show_counting = !$scope.show_counting;
    $scope.show_list = false;
    $scope.match_accounts = false;
  }

  $scope.showIndex = function(index){

    
    $scope.show_index = index;
  }

  $scope.addOrder = function(){
    var Orders = AV.Object.extend('Orders');
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
    if (order.zhuangtai == '正在做') {
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

    for (var i = 0; i < $scope.accounts_obj.length; i++) {
      if ($scope.accounts_obj[i].taobao == order.taobao) {
        taobao = order.taobao;
        sikehao = $scope.accounts_obj[i].sikehao;
      }
    }


    order.set('taobao',order.taobao);
    order.set('sikehao',sikehao);


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

app.controller('WanchengController', function($routeParams, $rootScope, $scope,UserService) {
  $scope.accounts_obj = UserService.getAccounts();

  $scope.zhongjia = 0;
  $scope.yongjin = 0;
  
  $scope.zhuangTaiClass = function(order){
    var return_class = ""
    if (order.zhuangtai == '完成') {
      return_class  = 'bg_green'; 
    }

    if (order.zhuangtai == '快递到') {
      return_class  = 'bg_orange'; 
    }

    return return_class;
  }

  var init_orders = function(){
    $scope.order_page = 1;
    $scope.load_more_end = false;
    $scope.orders = [];
  
    var orders = UserService.getFinishOrders($scope.order_page);
    orders.then(function(orders){


      for (var i = 0; i < orders.length; i++) {
        orders[i].taobao = orders[i].get('taobao');
        orders[i].yaoqiu = orders[i].get('yaoqiu');
        orders[i].dianpu = orders[i].get('dianpu');
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


        var date = new Date(orders[i].get('updatedAt'));

        var d = date.getDate();
        var m = date.getMonth() + 1; //Month from 0 to 11
        var y = date.getFullYear();

        var time = y + "-" + m + "-" + d;
        orders[i].time = time;

        

        $scope.zhongjia = $scope.zhongjia + parseInt(orders[i].jiage);
        $scope.yongjin = $scope.yongjin + parseInt(orders[i].yongjin);


        

      }


      $scope.orders = orders;
      if (!orders || !orders[19]) {
        $scope.load_more_end = true;
      }
    })
  }

  init_orders();

  

});

app.controller('MyProfileController', function($location,$rootScope, $scope,UserService) {
  UserService.removeCache();

  $scope.user_data = {};
  $scope.show_edit = false;
  var user = AV.User.current();
  $scope.user = user;

  $scope.graduate_year = [];

  for (var i = 0 ; i <= 80; i++) {
    var year = 2017 - i;
    $scope.graduate_year.push(year);
  }
  
  $scope.show_profile = false;
  $scope.show_edit_form = true;

  if (user) {
    $scope.user_data.name = user.get('name') ? user.get('name') : '';
    $scope.user_data.sex = user.get('sex') ? user.get('sex') : '';
    $scope.user_data.school = user.get('school') ? user.get('school') : '';
    $scope.user_data.company = user.get('company') ? user.get('company') : '';
    $scope.user_data.industry = user.get('industry') ? user.get('industry') : '';
    $scope.user_data.mobile = user.get('mobilePhoneNumber') ? user.get('mobilePhoneNumber') : '';
    $scope.user_data.graduate_year = user.get('graduate_year') ? user.get('graduate_year') : '';
    $scope.user_data.graduate_type = user.get('graduate_type') ? user.get('graduate_type') : '高中';


    $scope.user_data.home_town = user.get('home_town') ? user.get('home_town') : '';

    $scope.user_data.country = user.get('country') ? user.get('country') : '';
    $scope.user_data.city = user.get('city') ? user.get('city') : '';
  }

  $scope.logOut = function(){
    AV.User.logOut();
    $location.path("/login" );

  }

  $scope.cancel = function(){
    $scope.show_import = false;
    user.set('import',true);
    user.save();
  }
  

  $scope.importProfile = function(){
    user.set('name',$scope.profile.get('name'));
    user.set('sex',$scope.profile.get('sex'));
    user.set('school',$scope.profile.get('school'));
    user.set('company',$scope.profile.get('company'));
    user.set('mobilePhoneNumber',$scope.profile.get('number'));

    user.save();

    $scope.user_data.name = user.get('name') ? user.get('name') : '';
    $scope.user_data.sex = user.get('sex') ? user.get('sex') : '';
    $scope.user_data.school = user.get('school') ? user.get('school') : '';
    $scope.user_data.company = user.get('company') ? user.get('company') : '';
    $scope.user_data.industry = user.get('industry') ? user.get('industry') : '';
    $scope.user_data.mobile = user.get('mobilePhoneNumber') ? user.get('mobilePhoneNumber') : '';

    $scope.show_import = false;
    $scope.show_edit_form = true;
    $scope.show_profile = false;
  }

  $scope.showEditProfile = function(){
    $scope.show_edit_form = !$scope.show_edit_form;
  }

  $scope.saveProfile = function(){
    if ($scope.user_data.name) {
      user.set('name',$scope.user_data.name);
    }

    if ($scope.user_data.sex) {
      user.set('sex',$scope.user_data.sex);
    }

    if ($scope.user_data.school) {
      user.set('school',$scope.user_data.school);
    }

    if ($scope.user_data.company) {
      user.set('company',$scope.user_data.company);
    }

    if ($scope.user_data.mobile) {
      user.set('mobilePhoneNumber',$scope.user_data.mobile);
    }

    if ($scope.user_data.graduate_year) {
      user.set('graduate_year',$scope.user_data.graduate_year);
    }

    if ($scope.user_data.home_town) {
      user.set('home_town',$scope.user_data.home_town);
    }

    if ($scope.user_data.industry) {
      user.set('industry',$scope.user_data.industry);
    }

    if ($scope.user_data.graduate_type) {
      user.set('graduate_type',$scope.user_data.graduate_type);
    }


    user.set('country',$scope.user_data.country);
    user.set('city',$scope.user_data.city);

    user.save();
  }

  

  $scope.goHome = function(){
    $location.path("/" );

  }

  

});





app.controller('LoginController', function($location, $rootScope, $scope) {
  $scope.enable_login = true;
  $scope.input = {};
  $scope.sign_up_input = {};

  $scope.enableCheck = function(){
    $scope.lock_get_phone_code = false;
    $scope.number_message = false;
  }


  $scope.signUpCheck = function(){

    $scope.sign_up_input.message = '';

    if (!$scope.sign_up_input.phone) {
      $scope.sign_up_input.message += '输入手机号'
    }

    if (!$scope.sign_up_input.pass_word) {
      $scope.sign_up_input.message += '输入密码'
    }
  }

  $scope.signUp = function(){
     // 新建 AVUser 对象实例
    var user = new AV.User();

    console.log($scope.sign_up_input.phone);

    // 设置用户名
    user.setUsername('18922706142');
    // 设置密码
    user.setPassword($scope.sign_up_input.pass_word);
    // 设置邮箱
    user.setEmail($scope.sign_up_input.phone + '@qq.com');
    user.signUp().then(function (loggedInUser) {
        console.log(loggedInUser);

        $location.path("/login" );
    }, function (error) {
    });
  }

  $scope.sendPhoneCode = function(){
    $scope.lock_get_phone_code = true;
    
    var phone = $scope.input.phone.toString();
    AV.Cloud.requestSmsCode(phone).then(function (success) {
      

      $scope.$apply(function() {
        $scope.show_login_btn = true;
        $scope.number_message = '验证码已发送';
      });

    }, function (error) {
      $scope.$apply(function() {
        $scope.number_message = '无效的手机号码';
      });
    });
  }

  $scope.showSignUp = function(){
    $scope.show_sign_up = true;
  }

  $scope.backLogin = function(){
    $scope.show_sign_up = false;
  }


  

  $scope.login = function(){

    var phone = $scope.input.phone.toString();
    var pass_word = $scope.input.pass_word.toString();

     AV.User.logIn(phone, pass_word).then(function (loggedInUser) {
      console.log(loggedInUser);
      $location.path("/" );
    }, function (error) {
    });

  }
});

app.controller('SignUpController', function($location, $rootScope, $scope,UserService) {
  
  

});

app.controller('LogoutController', function($location, $rootScope, $scope,UserService) {
  $scope.logOut = function(){
    AV.User.logOut();
    $location.path("/login" );

  }
  

});

app.controller('YearContactController', function($location, $rootScope, $scope,UserService) {
  $scope.logOut = function(){
    AV.User.logOut();
    $location.path("/login" );

  }
  

});

app.controller('ListKeyWordsController', function($location, $rootScope, $scope,UserService) {

  var query = new AV.Query('User');
      query.exists('industry');
      query.exists('name');
      query.descending('industry');
      query.limit(300);
      query.find().then(function (users) {
        var key_word_arr = [];
        var key_word_objs = [];

        for (var i = users.length - 1; i >= 0; i--) {
          var key = users[i].get('industry');
          var index = key_word_arr.indexOf(key);
          if (index < 0) {
            key_word_arr.push(key);
            var obj = {};
            obj.key = key;
            obj.users = [];
            obj.users.push(users[i]);
            key_word_objs.push(obj);
          }else{
            for (var j = key_word_objs.length - 1; j >= 0; j--) {
              var obj = key_word_objs[j];
              if (obj.key == key) {
                obj.users.push(users[i]);
              }
            }
          }
        }

        var user_obj = key_word_objs[0];
        for (var i = key_word_objs.length - 1; i >= 0; i--) {
          if (key_word_objs[i].users.length > user_obj.users.length) {
            user_obj = key_word_objs[i];
          }
        }

        $scope.$apply(function() {
          user_obj.in_show = true;
          $scope.key_word_objs = key_word_objs;
          $scope.obj = user_obj;
          $scope.users = user_obj.users;
        });

        

        

      }).catch(function(error) {
      // alert(JSON.stringify(error));
      });
  

  $scope.showUsers = function(obj){
    for (var i = $scope.key_word_objs.length - 1; i >= 0; i--) {
      $scope.key_word_objs[i].in_show = false;
      obj.in_show = true;
    }

    $scope.obj = obj;
    $scope.users = obj.users;
  }

  $scope.keyWordClass = function(obj){
    if (obj.in_show) {
      return "active";
    }
  }

  $scope.triggerProfile = function(user){
    user.show = !user.show;
  }

});
app.controller('DataWordsController', function($location, $rootScope, $scope,UserService) {
  console.log('DataWordsController..');
    
  var users = UserService.getUsers(1);
  users.then(function(users){
    console.log(users);  
  })

});









