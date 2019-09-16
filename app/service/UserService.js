app.factory('UserService', ['$rootScope','$q',function($rootScope,$q){
    var user = AV.User.current();
    var orders_list = {};

    var service = {
        
        test: function() {
            console.log('UserService service..');
        },

        countTime: function(end_time,begin_time){
            let startTime = new Date(begin_time); // 开始时间
            let endTime = new Date(end_time); // 结束时间
            let usedTime = endTime - startTime; // 相差的毫秒数
            let days = Math.floor(usedTime / (24 * 3600 * 1000)); // 计算出天数
            let leavel = usedTime % (24 * 3600 * 1000); // 计算天数后剩余的时间
            let hours = Math.floor(leavel / (3600 * 1000)); // 计算剩余的小时数
            let leavel2 = leavel % (3600 * 1000); // 计算剩余小时后剩余的毫秒数
            let minutes = Math.floor(leavel2 / (60 * 1000)); // 计算剩余的分钟数

            var obj = {};
            obj.days = days;
            obj.hours = hours;
            obj.minutes = minutes;
            obj.times = days + '天' + hours + '时' + minutes + '分';

            return obj;
        },

        getMatchAccounts: function() {
            var match_accounts = [];

            var obj = {};
            obj.name = 'michaeljohndok';
            obj.guishu = '麦国权';
            match_accounts.push(obj);

            var obj = {};
            obj.name = '阿罪罪1099001573';
            obj.guishu = '麦国权';
            match_accounts.push(obj);

            var obj = {};
            obj.name = '余丽fh丽乐敏';
            obj.guishu = '麦国权';
            match_accounts.push(obj);
            
            var obj = {};
            obj.name = '你不在qr5';
            obj.guishu = '梁惠珍';
            match_accounts.push(obj);



            var obj = {};
            obj.name = '洁bv萱莹';
            obj.guishu = '梁惠珍';
            match_accounts.push(obj);

            var obj = {};
            obj.name = 'hz2857';
            obj.guishu = '梁惠珍';
            match_accounts.push(obj);

            


            var obj = {};
            obj.name = '广百sd女鞋代';
            obj.guishu = '梁杰辉';
            match_accounts.push(obj);

            var obj = {};
            obj.name = '千千商城h';
            obj.guishu = '梁杰辉';
            match_accounts.push(obj);

            var obj = {};
            obj.name = '焦玫hk咏';
            obj.guishu = '梁杰辉';
            match_accounts.push(obj);

            var obj = {};
            obj.name = '麻幽b雅萱萍';
            obj.guishu = '麦碧玉';
            match_accounts.push(obj);

            var obj = {};
            obj.name = '向慧亮悦玉';
            obj.guishu = '麦碧玉';
            match_accounts.push(obj);

            var obj = {};
            obj.name = '汇聚一轩';
            obj.guishu = '麦碧玉';
            match_accounts.push(obj);

            var obj = {};
            obj.name = '墨嫣莹dfh泽';
            obj.guishu = '麦方森';
            match_accounts.push(obj);

            var obj = {};
            obj.name = '我是hj佳欣';
            obj.guishu = '麦方森';
            match_accounts.push(obj);

            var obj = {};
            obj.name = '杏帘招客至毫';
            obj.guishu = '麦国明';
            match_accounts.push(obj);

            return match_accounts;
        },

        getAccounts: function() {
            var accounts_obj = [];

            var obj1 = {};
            obj1.taobao = 'michaeljohndok';
            obj1.sikehao = 'michaeljohndok';

            accounts_obj.push(obj1);

            var obj2 = {};
            obj2.taobao = 'hz2857';
            obj2.sikehao = 'hz888';

            accounts_obj.push(obj2);

            var obj3 = {};
            obj3.taobao = '汇聚一轩';
            obj3.sikehao = '汇聚一轩';
            accounts_obj.push(obj3);

            var obj4 = {};
            obj4.taobao = '杏帘招客至毫';
            obj4.sikehao = '杏帘招客至毫';
            accounts_obj.push(obj4);

            var obj5 = {};
            obj5.taobao = 'maiguo_007';
            obj5.sikehao = 'maiguo_007';
            accounts_obj.push(obj5);

            var obj6 = {};
            obj6.taobao = '魔法保we健';
            obj6.sikehao = '魔法保we健';
            accounts_obj.push(obj6);

            var obj7 = {};
            obj7.taobao = '阿罪罪1099001573';
            obj7.sikehao = '阿罪罪1099001573';
            accounts_obj.push(obj7);

            var obj8 = {};
            obj8.taobao = '你不在qr5';
            obj8.sikehao = '你不在qr5';
            accounts_obj.push(obj8);

            

            
            
            // console.log(accounts_obj);
            

            return accounts_obj;
        },



        getPDDOrders:function(){
            var q = $q.defer();

            var query = new AV.Query('PDD');
                query.descending('createdAt');
                query.notEqualTo('remove',true);
                query.limit(200);

                
                // query.skip(skip);
                query.find().then(function (orders) {
                    console.log(orders);

                    q.resolve(orders);
                }).catch(function(error) {
                    console.log(error);
                // alert(JSON.stringify(error));
                });
            
             return q.promise;
        },

        getLiuShuiOrders:function(){
            var q = $q.defer();

            var query = new AV.Query('LiuShui');
                query.descending('createdAt');
                query.notEqualTo('remove',true);


                
                // query.skip(skip);
                query.find().then(function (orders) {

                    q.resolve(orders);
                }).catch(function(error) {
                    console.log(error);
                // alert(JSON.stringify(error));
                });
            
             return q.promise;
        },

        getLiveOrders:function(limit,search){
            var q = $q.defer();

            var query = new AV.Query('Orders');
                query.descending('createdAt');
                query.notEqualTo('remove',true);
                query.notEqualTo('zhuangtai','完成');


                
                // query.skip(skip);
                query.find().then(function (orders) {

                    q.resolve(orders);
                }).catch(function(error) {
                    console.log(error);
                // alert(JSON.stringify(error));
                });
            
             return q.promise;
        },

        getNotFinishOrders:function(limit,search){
            var q = $q.defer();

            var query = new AV.Query('Orders');
                query.descending('createdAt');
                query.notEqualTo('remove',true);

                // if (not_finish) {
                //     query.notEqualTo('zhuangtai','完成');
                // }
                

                if (search) {
                    query.equalTo('taobao',search);
                }

                if (limit) {
                    var integer = parseInt(limit, 10);
                    query.limit(integer);
                }else{
                    query.limit(150);
                }

                
                // query.skip(skip);
                query.find().then(function (orders) {

                    q.resolve(orders);
                }).catch(function(error) {
                    console.log(error);
                // alert(JSON.stringify(error));
                });
            
			 return q.promise;
        },

        getFinishOrders:function(page){
            var q = $q.defer();

            if (orders_list[page]) {
                q.resolve(orders_list[page]);
            }else{
                var limit = 300;

                var skip = limit * (page - 1);
                var query = new AV.Query('Orders');
                    query.descending('createdAt');
                    query.notEqualTo('remove',true);

                    query.equalTo('zhuangtai','完成');

                    query.limit(limit);
                    query.skip(skip);
                    query.find().then(function (orders) {
                        orders_list[page] = [];
                        for (var i = orders.length - 1; i >= 0; i--) {
                            orders_list[page].unshift(orders[i]);
                        }

                        q.resolve(orders);
                    }).catch(function(error) {
                        console.log(error);
                    // alert(JSON.stringify(error));
                    });
            }

            
             return q.promise;
        },

        getUserById:function(id){
            var self = this;
            var q = $q.defer();
            var query = new AV.Query('User');
            query.equalTo('objectId',id)
                query.first().then(function (user) {
                    if (user) {
                        q.resolve(user);
                    }else{
                        var bak_user = self.getBackUpUserById(id);
                        bak_user.then(function(user){
                            q.resolve(user);
                        })
                    }

                    
                }).catch(function(error) {
                // alert(JSON.stringify(error));
                });
             return q.promise;
        },


        getuserByPhone:function(phone){
            var q = $q.defer();
            var query = new AV.Query('Profile');
                query.equalTo('number',phone)
                query.first().then(function (profile) {
                    q.resolve(profile);
                }).catch(function(error) {
                // alert(JSON.stringify(error));
                });
             return q.promise;
        },

    };

    return service;

}]);