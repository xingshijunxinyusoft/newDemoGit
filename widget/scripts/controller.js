angular.module('Ctrls', [])

// 导航
	.controller('NavsController', ['$scope', function ($scope) {

		// 通常情况左侧导航的数据会来自于后端
		// $http({
		// 	url: '',
		// }).success(function (info) {
		// 	$scope.navs = info;
		// });

		// 假如导航是固定不变的就没有必要再发请求了
		// 可用数组进行模拟

		var navs = [
			{text: '今日一刻', link: '#/today', icon: 'icon-home'},
			{text: '往期内容', link: '#/older', icon: 'icon-file-empty'},
			{text: '热门作者', link: '#/author', icon: 'icon-pencil'},
			{text: '栏目浏览', link: '#/category', icon: 'icon-menu'}
			// {text: '我的喜欢', link: '#/favorite', icon: 'icon-heart'},
			// {text: '设置', link: '#/settings', icon: 'icon-cog'},
		];

		// 模型数据
		$scope.navs = navs;

	}])

	// 今日一刻
	.controller('TodayCtrl', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
		$rootScope.title = "今日一刻";
		$rootScope.loaded = true;
		$rootScope.current = 0;
		document.body.scrollTop = $rootScope.oldscroll;
		// 获得数据
		if ($rootScope.load) {
			$http.get('http://www.xingshijun.top/yike/api/today.php').success(function (info) {
				// 将获得的数据放到模型上
				$rootScope.load = false;
				$rootScope.info = info;
				$scope.posts = info.posts;
				$rootScope.posts = info.posts;
				$scope.date = info.date;
				$rootScope.date = info.date;
				$rootScope.loaded = false;

			});
		} else {
			$scope.posts = $rootScope.posts;
			$scope.date = $rootScope.date;
			$rootScope.loaded = false;
			document.body.scrollTop = $rootScope.oldscroll;
		}
		$scope.read = function (index) {
			$rootScope.oldscroll = document.body.scrollTop;
			location.hash = "#/content";
			// $('.body').scrollTop = 0
			document.body.scrollTop = 0
			$rootScope.conIdx = index;
			$rootScope.htmlStr = $rootScope.info.posts[$rootScope.conIdx].content;
			localStorage.htmlStr = $rootScope.htmlStr
		}

	}])
	// 往期内容
	.controller('OldCtrl', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
		$rootScope.title = "往期内容";
		$rootScope.loaded = true;
		$rootScope.current = 1;
		$rootScope.day = -1;
		// $scope.result = [];
		// 获得数据
		document.body.scrollTop = $rootScope.oldscroll;
		$scope.older = function () {
			$rootScope.loaded = true;
			document.body.scrollTop = 0
			//http://www.xingshijun.top/yike/api/older.php
			if ($rootScope.loaded) {
				$rootScope.result = {};
				$http({
					url: 'http://www.xingshijun.top/yike/api/older.php',
					params: {older: $rootScope.day--}
				}).success(function (info) {
					// 将获得的数据放到模型上
					$rootScope.result = Object.assign($rootScope.result, info.posts);
					// var btn = document.querySelectorAll(".more");
					// for (var i = 0; i < btn.length; i++) {
					//     if (i == btn.length) {
					//         return;
					//     }
					//     btn[i].remove();
					// }
					// console.log($rootScope.result)
					// 将获得的数据放到模型上
					$rootScope.loaded = false;
					$scope.posts = $rootScope.result;
					$rootScope.olddate = $scope.date = info.date;
					$scope.read = function (index) {
						$rootScope.oldscroll = document.body.scrollTop;
						location.hash = "#/content";
						document.body.scrollTop = 0
						$rootScope.oldconIdx = index;
						$rootScope.htmlStr = $rootScope.result[$rootScope.oldconIdx].content;
						localStorage.htmlStr = $rootScope.htmlStr
					}
				})
			}
			//  else {
			//     $scope.posts = $rootScope.result;
			//     $scope.date = $rootScope.olddate;
			//     // $rootScope.loaded = false;
			//     $scope.read = function(index) {

			//             // console.log(index)
			//             // console.log($rootScope.result[$rootScope.oldconIdx].content)
			//         location.hash = "#/oldcontent";
			//         document.body.scrollTop = 0
			//         $rootScope.oldconIdx = index;
			//         $rootScope.oldhtmlStr = $rootScope.result[$rootScope.oldconIdx].content;
			//     }
			// }
		}
		if (!$rootScope.result) {
			$scope.older()
		} else {
			$scope.posts = $rootScope.result;
			$scope.date = $rootScope.olddate;
			// window.scrollY = 0;
			document.body.scrollTop = $rootScope.oldscroll;
			$rootScope.loaded = false;
			$scope.read = function (index) {
				$rootScope.oldscroll = document.body.scrollTop;
				location.hash = "#/oldcontent";
				document.body.scrollTop = 0
				$rootScope.oldconIdx = index;
				$rootScope.oldhtmlStr = $rootScope.result[$rootScope.oldconIdx].content;
				localStorage.htmlStr = $rootScope.htmlStr
			}
		}
	}])
	.controller('AuthorCtrl', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
		$rootScope.title = "热门作者";
		$rootScope.loaded = true;
		$rootScope.current = 2;
		// 获得数据
		$http({
			url: 'http://www.xingshijun.top/yike/api/author.php'
		}).success(function (info) {
			// 将获得的数据放到模型上
			$scope.recAuthors = info.rec.authors;
			$scope.allAuthors = info.all.authors;
			$rootScope.loaded = false;
		});
	}])
	.controller('CategoryCtrl', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
		$rootScope.title = "栏目浏览";
		$rootScope.loaded = true;
		$rootScope.current = 3;
		// 获得数据
		$http({
			url: 'http://www.xingshijun.top/yike/api/category.php'
		}).success(function (info) {
			// 将获得的数据放到模型上
			$scope.columns = info.columns;
			$rootScope.loaded = false;

		})

	}])
	.controller('ContentCtrl', ['$scope', '$http', '$rootScope', '$sanitize', function ($scope, $http, $rootScope, $sanitize) {
		$rootScope.loaded = false;
		if (!$rootScope.htmlStr) {
			$rootScope.htmlStr = localStorage.htmlStr
		} else {
			$scope.htmlStr = $rootScope.htmlStr;
		}
	}])
	.controller('OldContentCtrl', ['$scope', '$http', '$rootScope', '$sanitize', function ($scope, $http, $rootScope, $sanitize) {
		$scope.oldhtmlStr = $rootScope.oldhtmlStr;
	}])