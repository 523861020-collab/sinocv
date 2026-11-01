console.log('[CRM] sidepanel.js loaded, version 2.1 FIXED');

// ========== 登录系统 ==========
var USERS={	'13001977959':{name:'李善龙',pass:'202502',role:'admin'},	'19103781257':{name:'王小涵',pass:'123123',role:'staff'},	'15715313849':{name:'毛振威',pass:'123123',role:'staff'},	'13523034981':{name:'赵欢乐',pass:'123123',role:'staff'},	'15903993573':{name:'杜飞跃',pass:'123123',role:'staff'},	'16601052225':{name:'测试',pass:'123123',role:'staff'}};
var currentUser=null,isLoggedIn=false;

// 检查登录状态
chrome.storage.local.get(['crm_auth'],function(d){
  var auth=d.crm_auth;
  if(auth&&USERS[auth.phone]&&USERS[auth.phone].pass===auth.pass){
    isLoggedIn=true;currentUser={phone:auth.phone,name:USERS[auth.phone].name,role:USERS[auth.phone].role};
    document.getElementById('loginModal').style.display='none';
    document.getElementById('mainApp').style.display='flex';
    initApp();
  }
});

function doLogin(){
  var phone=document.getElementById('loginPhone').value.trim();
  var pass=document.getElementById('loginPass').value;
  var err=document.getElementById('loginErr');
  if(!USERS[phone]){err.style.display='block';err.textContent='账号不存在';return;}
  if(USERS[phone].pass!==pass){err.style.display='block';err.textContent='密码错误';return;}
  // 登录成功，持久化
  chrome.storage.local.set({crm_auth:{phone:phone,pass:pass}},function(){
    isLoggedIn=true;currentUser={phone:phone,name:USERS[phone].name,role:USERS[phone].role};
    document.getElementById('loginModal').style.display='none';
    document.getElementById('mainApp').style.display='flex';
    initApp();
  });
}
document.getElementById('btnLogin').onclick=doLogin;
document.getElementById('loginPass').addEventListener('keydown',function(e){if(e.key==='Enter')doLogin();});

function isAdmin(){return currentUser&&currentUser.role==='admin';}
function initApp(){
  syncFromServer();
  syncProducts();
  if(isAdmin())setTimeout(checkPendingOrders,3000);
}
// ==============================
var CATEGORIES_BY_BRAND = {
  '中国重汽': ['牵引车','自卸车','载货车','搅拌车','油罐车/水罐车','垃圾运输车','高空作业车','随车吊','拖车','冷藏车','水泥泵车','消防车','吸污车'],
  '陕汽': ['牵引车','自卸车','载货车','搅拌车','油罐车/水罐车','垃圾运输车','高空作业车','随车吊','拖车','水泥泵车','消防车','吸污车'],
  '徐工': ['装载机','挖掘机','起重机','伸缩臂叉车','两头忙','推土机','平地机','压路机'],
  '中集': ['平板半挂','自卸半挂','侧帘半挂','厢式半挂','冷藏半挂','液罐半挂','粉罐半挂'],
  '轻型车': ['Van(重汽)','Van(福田)','Van(依维柯)']
};
var DRIVES=['4×2','4×4','6×4','6×6','8×4'];
var DEFAULT_PRODUCTS = {
  "阿尔及利亚": {
    "HOWO": {
      "自卸车": {
        "6×4": [
          {
            "model": "HOWO 6X4自卸车16方",
            "config": "SINOTRUK HOWO 6X4 TIPPER TRUCK LHD-16 CBM\nCab: HW76 model, with single sleeper, with AC \nEngine: WECHAI WP10.340E22, 340PS, Euro II\nGear box: HW19709XST 9F&1R, With synchronizer and PTO\nSteering: BOSCH brand\nFront axle: 9500KGS steering axle with drum brake\nRear axle: 2*16000KGS axle with drum brake\nSuspension: Reinforced parabolic multi-leaf springs\nFuel tank: 400L\nTire: 315/80R22.5 tubeless, with one spare tire\nWith ABS(4S/4M)\nWith EVB\nWith driver air suspension seat \nWith front u",
            "fob": "$41,600",
            "shipping": "$4,900",
            "cfr": "$46,500"
          },
          {
            "model": "HOWO 6X4自卸车18方",
            "config": "SINOTRUK HOWO 6X4 TIPPER TRUCK LHD-18 CBM\nCab: HW76 model, with single sleeper, with AC \nEngine: WECHAI WP10.380E22, 380PS, Euro II\nGear box: HW19709XST 9F&1R, With synchronizer and PTO\nSteering: BOSCH brand\nFront axle: 9500KGS steering axle with drum brake\nRear axle: 2*16000KGS axle with drum brake\nSuspension: Reinforced parabolic multi-leaf springs\nFuel tank: 400L\nTire: 315/80R22.5 tubeless, with one spare tire\nWith ABS(4S/4M)\nWith EVB\nWith electronic cab-flip system \nWith driver ",
            "fob": "$43,600",
            "shipping": "$5,300",
            "cfr": "$48,900"
          }
        ],
        "8×4": [
          {
            "model": "HOWO 8X4自卸车22方",
            "config": "SINOTRUK HOWO 8X4 TIPPER TRUCK LHD -22CBM\nCab: HW76, with single sleeper\nWheelbase: 3200mm\nEngine: WECHAI WP12S400E201, 400PS, EuroⅡemission\nGearBox: HW19709XST, 9F&1R, With Synchronizer and PTO\nSteering: BOSCH brand\nFront axle: 9500kg*2 steering axle with drum brake\nRear axle:16000kg*2 axle with drum brake\nSuspension: Reinforced parabolic multi-leaf springs\nTire: 315/80R22.5 tubeless, with one spare tire\nFuel tank: 400L\nCompliance with Algeria regulatory requirements\nWith Air-condit",
            "fob": "$50,800",
            "shipping": "$6,100",
            "cfr": "$56,900"
          },
          {
            "model": "HOWO 8X4自卸车货箱长7.6米，36方",
            "config": "SINOTRUK HOWO 8X4 TIPPER TRUCK LHD\nCab:HW76 New Front-Face Cab\nWheelbase: 4200mm\nEngine: WP12S430E201 Engine EuroⅡemission\nGearBox:HW19710 + HW50 Direct-Drive Power Take-Off\nSteering: BOSCH brand\nFront axle: 9500kg*2 steering axle with drum brake\nRear axle:16000kg*2 axle with drum brake\nSuspension: Front and rear reinforced multi-leaf springs\n(11/11/12)\nTire: 12.00/R20 Mixed pattern\nFuel tank: 400L\nCompliance with Algeria regulatory requirements\nWith Intercooler Protection Device\nW",
            "fob": "$50,600",
            "shipping": "$12,100",
            "cfr": "$62,700"
          }
        ]
      },
      "搅拌车": {
        "6×4": [
          {
            "model": "HOWO 6X4搅拌车10方",
            "config": "SINOTRUK HOWO 6X4 MIXER TRUCK LHD-10 CBM\nCab: HW76 model, with single sleeper, with AC \nEngine: WECHAI WP10.380E22, 380PS, Euro II, With PTO\nGear box: HW19709XST 9F&1R, With synchronizer\nSteering: BOSCH brand\nFront axle: 9500KGS steering axle with drum brake\nRear axle: 2*16000KGS axle with drum brake\nSuspension: Reinforced parabolic multi-leaf springs\nFuel tank: 400L\nTire: 315/80R22.5 tubeless, with one spare tire\nWith ABS(4S/4M)\nWith EVB\nWith electronic cab-flip system \nWith driver",
            "fob": "$49,700",
            "shipping": "$6,600",
            "cfr": "$56,300"
          }
        ],
        "8×4": [
          {
            "model": "HOWO 8X4搅拌车12方",
            "config": "SINOTRUK HOWO 8X4 MIXER TRUCK LHD -12CBM\nCab: HW76, with single sleeper\nWheelbase: 3200mm\nEngine: WECHAI WP12S400E201, 400PS, EuroⅡemission With PTO\nGearBox: HW19709XST, 9F&1R, With Synchronizer\nSteering: BOSCH brand\nFront axle: 9500kg*2 steering axle with drum brake\nRear axle:16000kg*2 axle with drum brake\nSuspension: Reinforced parabolic multi-leaf springs\nTire: 315/80R22.5 tubeless, with one spare tire\nFuel tank: 400L\nCompliance with Algeria regulatory requirements\nWith Air-condit",
            "fob": "$56,800",
            "shipping": "$7,400",
            "cfr": "$64,200"
          }
        ]
      },
      "洒水车": {
        "6×4": [
          {
            "model": "HOWO 6X4洒水车22方",
            "config": "SINOTRUK HOWO 6X4 SPRINKLER TRUCK LHD\nCab: HW76, with single sleeper\nWheelbase: 4600mm\nEngine: WECHAI WP10.340E22, 340PS, EuroⅡ\nGearBox: HW19709XST,9F&1R, with Synchronizer and PTO\nSteering : BOSCH brand \nFront axle: 7000KGS with drum brake \nRear axle: 16000KGS*2 with drum brake \nTire: 315/80R22.5 tubeless, with one spare tire\nFuel tank: 400L\nCompliance with regulatory requirements\nWith Air-conditioner，\nWith ABS \nWith EVB\nWith Reversing buzzer,\nWith Tachograph， \nwith cruise contr",
            "fob": "$46,100",
            "shipping": "$5,500",
            "cfr": "$51,600"
          }
        ]
      },
      "随车吊": {
        "4×2": [
          {
            "model": "HOWO 4X2随车吊 8吨",
            "config": "SINOTRUK HOWO 4X2 TRUCK MOUNTED CRANE LHD\nCab: HW76, with single sleeper\nWheelbase: 4600mm\nEngine: WECHAI WP10.300E22, 300PS, EuroⅡ\nGearBox: HW19709XST,9F&1R, with Synchronizer and PTO\nSteering : BOSCH brand \nFront axle: 7000KGS with drum brake \nRear axle: 16000KGS with drum brake \nTire: 315/80R22.5 tubeless, with one spare tire\nFuel tank: 400L\nCompliance with regulatory requirements\nWith Air-conditioner，\nWith ABS \nWith EVB\nWith Reversing buzzer,\nWith Tachograph， \nwith cruise con",
            "fob": "$52,100",
            "shipping": "$5,300",
            "cfr": "$57,400"
          }
        ]
      },
      "油罐车": {
        "4×2": [
          {
            "model": "HOWO 4X2油罐车 12方",
            "config": "SINOTRUK HOWO 4X2 FUEL TANK TRUCK LHD\nCab: HW76, with single sleeper\nWheelbase: 4600mm\nEngine: WECHAI WP10.300E22, 300PS, EuroⅡ\nGearBox: HW19709XST,9F&1R, with Synchronizer and PTO\nSteering : BOSCH brand \nFront axle: 7000KGS with drum brake \nRear axle: 16000KGS with drum brake \nTire: 315/80R22.5 tubeless, with one spare tire\nFuel tank: 400L\nCompliance with regulatory requirements\nWith Air-conditioner，\nWith ABS \nWith EVB\nWith Reversing buzzer,\nWith Tachograph， \nwith cruise control",
            "fob": "$39,600",
            "shipping": "$4,900",
            "cfr": "$44,500"
          }
        ]
      }
    },
    "TX/T7H": {
      "牵引车": {
        "4×2": [
          {
            "model": "T7H 4X2平顶牵引车-13吨后桥",
            "config": "SINOTRUK HOWO-T7H 4x2 TRACTOR TRUCK LHD\nCab: T7H–P Cabin with simple sleeper，with AC\nWheelbase: 3900mm\nEngine: MC11.43-30,430PS, EuroⅢ(MAN TECHNOLOGY)\nGear box: HW25712XSTCL,12F& 2R, With synchronizer\nSteering: BOSCH brand\nFuel tank: 600L+300L\nFront axle:7000kgs (MAN TECHNOLOGY)，drum brake\nRear axle: 13000kgs (MAN TECHNOLOGY)，drum brake\nTire: 315/80R22.5 tubeless, With one spare tire\nCompliance with regulatory requirements\nOthers： \nWith ABS\nWith long-life engine diesel filter,\nWith",
            "fob": "$39,900",
            "shipping": "$3,800",
            "cfr": "$43,700"
          },
          {
            "model": "T7H 4X2平顶牵引车-16吨后桥 （选装液压系统+2000美元）",
            "config": "SINOTRUK HOWO-T7H 4x2 TRACTOR TRUCK LHD\nCab: T7H–P Cabin with simple sleeper，with AC\nWheelbase: 3900mm\nEngine: MC11.43-30,430PS, EuroⅢ(MAN TECHNOLOGY)\nGear box: HW25712XSTCL,12F& 2R, With synchronizer\nSteering: BOSCH brand\nFuel tank: 600L+300L\nFront axle:7000kgs (MAN TECHNOLOGY)，drum brake\nRear axle: 16000kgs (MAN TECHNOLOGY)，drum brake\nTire: 315/80R22.5 tubeless, With one spare tire\nCompliance with regulatory requirements\nOthers： \nWith ABS\nWith long-life engine diesel filter,\nWith",
            "fob": "$42,300",
            "shipping": "$3,800",
            "cfr": "$46,100"
          }
        ],
        "6×4": [
          {
            "model": "T7H 6X4平顶牵引车-13吨后桥",
            "config": "SINOTRUK HOWO-T7H 6X4 TRACTOR TRUCK LHD\nCab: T7H–P Cabin with simple sleeper，with AC\nWheelbase: 3400mm\nEngine: MC11.43-30,430PS, EuroⅢ(MAN TECHNOLOGY)\nGear box: HW25712XSTCL,12F& 2R, With synchronizer\nSteering: BOSCH brand\nFuel tank: 600L+300L\nFront axle:7000kgs (MAN TECHNOLOGY)，drum brake\nRear axle: 13000kgs*2 (MAN TECHNOLOGY)，drum brake\nTire: 315/80R22.5 tubeless, With one spare tire\nCompliance with regulatory requirements\nOthers： \nWith ABS\nWith long-life engine diesel filter,\nWi",
            "fob": "$44,900",
            "shipping": "$4,200",
            "cfr": "$49,100"
          },
          {
            "model": "T7H 6X4高顶牵引车-13吨后桥",
            "config": "SINOTRUK HOWO-T7H 6X4 TRACTOR TRUCK LHD\nCab: T7H–G Cabin with double sleeper，with AC\nWheelbase: 3400mm\nEngine: MC11.43-30,430PS, EuroⅢ(MAN TECHNOLOGY)\nGear box: HW25712XSTCL,12F& 2R, With synchronizer\nSteering: BOSCH brand\nFuel tank: 600L+300L\nFront axle:7000kgs (MAN TECHNOLOGY)，drum brake\nRear axle: 13000kgs*2 (MAN TECHNOLOGY)，drum brake\nTire: 315/80R22.5 tubeless, With one spare tire\nCompliance with regulatory requirements\nOthers： \nWith ABS\nWith long-life engine diesel filter,\nWi",
            "fob": "$45,300",
            "shipping": "$4,800",
            "cfr": "$50,100"
          },
          {
            "model": "T7H 6X4平顶牵引车-16吨后桥 （选装液压系统+2000美元）",
            "config": "SINOTRUK HOWO-T7H 6X4 TRACTOR TRUCK LHD\nCab: T7H–P Cabin with simple sleeper，with AC\nWheelbase: 3400mm\nEngine: MC11.43-30,430PS, EuroⅢ(MAN TECHNOLOGY)\nGear box: HW25712XSTCL,12F& 2R, With synchronizer and PTO\nSteering: BOSCH brand\nFuel tank: 600L+300L\nFront axle:9000kgs (MAN TECHNOLOGY)，drum brake\nRear axle: 16000kgs*2 (MAN TECHNOLOGY)，drum brake\nTire: 315/80R22.5 tubeless, With one spare tire\nCompliance with regulatory requirements\nOthers： \nWith ABS\nWith long-life engine diesel fil",
            "fob": "$47,900",
            "shipping": "$4,200",
            "cfr": "$52,100"
          },
          {
            "model": "T7H 6X4高顶牵引车-16吨后桥 （选装液压系统+2000美元）",
            "config": "SINOTRUK HOWO-T7H 6X4 TRACTOR TRUCK LHD\nCab: T7H–G Cabin with double sleeper，with AC\nWheelbase: 3400mm\nEngine: MC11.43-30,430PS, EuroⅢ(MAN TECHNOLOGY)\nGear box: HW25712XSTCL,12F& 2R, With synchronizer and PTO\nSteering: BOSCH brand\nFuel tank: 600L+300L\nFront axle:9000kgs (MAN TECHNOLOGY)，drum brake\nRear axle: 16000kgs*2 (MAN TECHNOLOGY)，drum brake\nTire: 315/80R22.5 tubeless, With one spare tire\nCompliance with regulatory requirements\nOthers： \nWith ABS\nWith long-life engine diesel fil",
            "fob": "$48,300",
            "shipping": "$5,000",
            "cfr": "$53,300"
          }
        ]
      },
      "自卸车": {
        "6×4": [
          {
            "model": "TX 6X4自卸车16方",
            "config": "SINOTRUK HOWO TX 6X4 TIPPER TRUCK LHD-16 CBM\nCab: TX-F cabin, with single sleeper, with AC \nEngine: WECHAI WP10.340E22, 340PS, Euro II\nGear box: HW19709XST 9F&1R, With synchronizer and PTO\nSteering: BOSCH brand\nFront axle: 9500KGS steering axle with drum brake\nRear axle: 2*16000KGS axle with drum brake\nSuspension: Reinforced parabolic multi-leaf springs\nFuel tank: 400L\nTire: 315/80R22.5 tubeless, with one spare tire\nWith ABS(4S/4M)\nWith EVB\nWith driver air suspension seat \nWith fron",
            "fob": "$45,100",
            "shipping": "$4,900",
            "cfr": "$50,000"
          },
          {
            "model": "TX 6X4自卸车18方",
            "config": "SINOTRUK HOWO TX 6X4 TIPPER TRUCK LHD-18 CBM\nCab: TX-F cabin, with single sleeper, with AC \nEngine: WECHAI WP10.380E22, 380PS, Euro II\nGear box: HW19709XST 9F&1R, With synchronizer and PTO\nSteering: BOSCH brand\nFront axle: 9500KGS steering axle with drum brake\nRear axle: 2*16000KGS axle with drum brake\nSuspension: Reinforced parabolic multi-leaf springs\nFuel tank: 400L\nTire: 315/80R22.5 tubeless, with one spare tire\nWith ABS(4S/4M)\nWith EVB\nWith electronic cab-flip system \nWith driv",
            "fob": "$46,100",
            "shipping": "$5,300",
            "cfr": "$51,400"
          }
        ],
        "8×4": [
          {
            "model": "TX 8X4自卸车22方",
            "config": "SINOTRUK HOWO TX 8X4 TIPPER TRUCK LHD -22CBM\nCab: TX-F cabin, with single sleeper\nWheelbase: 3200mm\nEngine: WECHAI WP12S400E201, 400PS, EuroⅡemission\nGearBox: HW19709XST, 9F&1R, With Synchronizer and PTO\nSteering: BOSCH brand\nFront axle: 9500kg*2 steering axle with drum brake\nRear axle:16000kg*2 axle with drum brake\nSuspension: Reinforced parabolic multi-leaf springs\nTire: 315/80R22.5 tubeless, with one spare tire\nFuel tank: 400L\nCompliance with Algeria regulatory requirements\nWith A",
            "fob": "$53,600",
            "shipping": "$6,100",
            "cfr": "$59,700"
          }
        ]
      },
      "搅拌车": {
        "6×4": [
          {
            "model": "TX 6X4搅拌车10方",
            "config": "SINOTRUK HOWO 6X4 MIXER TRUCK LHD-10 CBM\nCab: TX-F cabin with single sleeper, with AC \nEngine: WECHAI WP10.380E22, 380PS, Euro II, With PTO\nGear box: HW19709XST 9F&1R, With synchronizer\nSteering: BOSCH brand\nFront axle: 9500KGS steering axle with drum brake\nRear axle: 2*16000KGS axle with drum brake\nSuspension: Reinforced parabolic multi-leaf springs\nFuel tank: 400L\nTire: 315/80R22.5 tubeless, with one spare tire\nWith ABS(4S/4M)\nWith EVB\nWith electronic cab-flip system \nWith driver ",
            "fob": "$52,100",
            "shipping": "$6,800",
            "cfr": "$58,900"
          }
        ]
      },
      "洒水车": {
        "6×4": [
          {
            "model": "TX 6X4洒水车22方",
            "config": "SINOTRUK HOWO TX 6X4 SPRINKLER TRUCK LHD\nCab: TX-F cabin, with single sleeper\nWheelbase: 4600mm\nEngine: WECHAI WP10.340E22, 340PS, EuroⅡ\nGearBox: HW19709XST,9F&1R, with Synchronizer and PTO\nSteering : BOSCH brand \nFront axle: 7000KGS with drum brake \nRear axle: 16000KGS*2 with drum brake \nTire: 315/80R22.5 tubeless, with one spare tire\nFuel tank: 400L\nCompliance with regulatory requirements\nWith Air-conditioner，\nWith ABS \nWith EVB\nWith Reversing buzzer,\nWith Tachograph， \nwith cru",
            "fob": "$48,900",
            "shipping": "$5,500",
            "cfr": "$54,400"
          }
        ]
      },
      "随车吊": {
        "4×2": [
          {
            "model": "TX 4X2随车吊 8吨",
            "config": "SINOTRUK HOWO TX 4X2 TRUCK MOUNTED CRANE LHD\nCab: TX-F cabin, with single sleeper\nWheelbase: 4600mm\nEngine: WECHAI WP10.300E22, 300PS, EuroⅡ\nGearBox: HW19709XST,9F&1R, with Synchronizer and PTO\nSteering : BOSCH brand \nFront axle: 7000KGS with drum brake \nRear axle: 16000KGS with drum brake \nTire: 315/80R22.5 tubeless, with one spare tire\nFuel tank: 400L\nCompliance with regulatory requirements\nWith Air-conditioner，\nWith ABS \nWith EVB\nWith Reversing buzzer,\nWith Tachograph， \nwith c",
            "fob": "$54,600",
            "shipping": "$5,300",
            "cfr": "$59,900"
          }
        ],
        "6×4": [
          {
            "model": "TX 6X4随车吊12吨",
            "config": "SINOTRUK HOWO-TX 6X4 TRUCK\nMOUNTED CRANE\nZZ1257N464GB1\nBrand: HOWO; Application: Truck\nDrive Axle: MCX16ZG Dual Rear Axle\n(Drum)\nFrame: Double-layer frame (8+5/300)\nSuspension: Standard front and rear multi_x0002_leaf springs (10/12)\nTransmission: HW19709XST transmission +\nHW70 flange-mounted power take-off\nEngine: WP10.340E22 engine\nCab: TX-F cab\nTires: 315/80R22.5 (front longitudinal\ntread/rear block tread/18PR/spare tire)\nABS: 4S/4M\nSpeed Ratio: 4.803\nBumper: High-mounted bump",
            "fob": "$69,500",
            "shipping": "$10,800",
            "cfr": "$80,300"
          }
        ]
      },
      "油罐车": {
        "4×2": [
          {
            "model": "TX 4X2油罐车 12方",
            "config": "SINOTRUK HOWO TX 4X2 FUEL TANK TRUCK LHD\nCab: TX-F cabin, with single sleeper\nWheelbase: 4600mm\nEngine: WECHAI WP10.300E22, 300PS, EuroⅡ\nGearBox: HW19709XST,9F&1R, with Synchronizer and PTO\nSteering : BOSCH brand \nFront axle: 7000KGS with drum brake \nRear axle: 16000KGS with drum brake \nTire: 315/80R22.5 tubeless, with one spare tire\nFuel tank: 400L\nCompliance with regulatory requirements\nWith Air-conditioner，\nWith ABS \nWith EVB\nWith Reversing buzzer,\nWith Tachograph， \nwith cruis",
            "fob": "$42,600",
            "shipping": "$4,900",
            "cfr": "$47,500"
          }
        ],
        "6×4": [
          {
            "model": "TX 6X4油罐车 20方",
            "config": "SINOTRUK HOWO TX 6X4 FUEL TANK TRUCK LHD\nCab: TX-F cabin, with single sleeper\nWheelbase: 4625mm\nEngine: WP10.340E22, 340PS, EuroⅡ\nGearBox: HW19709XST Transmission + HW70 Flange- Mounted Power Take-Off\nSteering : BOSCH brand\nFront axle: 7000KGS with drum brake\nRear axle: 16000KGS *2with drum brake\nTire: 315/80R22.5 tubeless, with one spare tire\nFuel tank: 400L\nCompliance with regulatory requirements\nWith Air-conditioner，\nWith ABS\nWith EVB\nWith Reversing buzzer, With Tachograph，\nwit",
            "fob": "$46,300",
            "shipping": "$9,600",
            "cfr": "$55,900"
          }
        ]
      },
      "载货车": {
        "4×2": [
          {
            "model": "TX 4X2载货车底盘 47轴距",
            "config": "SINOTRUK HOWO TX 4X2 CARGO TRUCK CHASSIS LHD\nCab: TX-M model, with single small sleeper, with AC  \nWheelbase: 4700mm\nEngine: SINOTRUK MC07.28-30, 280hp EURO III emission \nGear box: HW13709XSTC2, Manual type with synchronizer and PTO, 9 F and 1 R\nSteering: BOSCH brand\nFront axle: 7000kg, steering axle with drum brake \nRear axle: 13000kg, driving axle with drum brake\n(MAN TECHNOLOGY AXLE)\nSuspension: Reinforced parabolic leaf springs\nFuel tank: single tanker with capacity 400L\nTire: 315",
            "fob": "$33,400",
            "shipping": "$4,600",
            "cfr": "$38,000"
          },
          {
            "model": "TX 4X2载货车底盘 62轴距",
            "config": "SINOTRUK HOWO TX 4X2 CARGO TRUCK CHASSIS LHD\nCab: TX-M model, with single small sleeper, with AC  \nWheelbase: 6200mm\nEngine: SINOTRUK MC07.28-30, 280hp EURO III emission \nGear box: HW13709XSTC2, Manual type with synchronizer and PTO, 9 F and 1 R\nSteering: BOSCH brand\nFront axle: 7000kg, steering axle with drum brake \nRear axle: 13000kg, driving axle with drum brake\n(MAN TECHNOLOGY AXLE)\nSuspension: Reinforced parabolic leaf springs\nFuel tank: single tanker with capacity 400L\nTire: 315",
            "fob": "$34,600",
            "shipping": "$5,700",
            "cfr": "$40,300"
          }
        ]
      },
      "冷藏车": {
        "4×2": [
          {
            "model": "TX4x2冷藏车47轴距",
            "config": "SINOTRUK HOWO TX 4X2 VAN TRUCK LHDCab: TX-M model, with single small sleeper, with ACWheelbase: 4700mm\nEngine: SINOTRUK MC07.28-30, 280hp EURO lll emissionGear box: HW13709XSTC2, Manual type with synchronizer andPTO, 9 F and 1 R\nSteering: BOSCH brand\nFront axle: 7000kg, steering axe with drum brakeRear axle: 13000kg, driving axle with drum brake(MAN TECHNOLOGY AXLE)\nSuspension: Reinforced parabolic leaf springsFuel tank: single tanker with capacity 400LTire: 315/80R22.5 tubeless, With one sp",
            "fob": "$41,100",
            "shipping": "$8,600",
            "cfr": "$49,700"
          }
        ]
      },
      "厢式车": {
        "4×2": [
          {
            "model": "TX4x2厢式车47轴距",
            "config": "SINOTRUK HOWO TX 4X2 VAN TRUCK LHDCab: TX-M model, with single small sleeper, with ACWheelbase: 4700mm\nEngine: SINOTRUK MC07.28-30, 280hp EURO lll emissionGear box: HW13709XSTC2, Manual type with synchronizer andPTO, 9 F and 1 R\nSteering: BOSCH brand\nFront axle: 7000kg, steering axe with drum brakeRear axle: 13000kg, driving axle with drum brake(MAN TECHNOLOGY AXLE)\nSuspension: Reinforced parabolic leaf springsFuel tank: single tanker with capacity 400LTire: 315/80R22.5 tubeless, With one sp",
            "fob": "$37,500",
            "shipping": "$9,400",
            "cfr": "$46,900"
          }
        ]
      }
    },
    "SITRAK": {
      "牵引车": {
        "4×2": [
          {
            "model": "SITRAK-4X2牵引车 G7-P单卧铺-430马力-手动挡- 标载版-板簧悬架",
            "config": "SINOTRUK SITRAK 4x2 TRACTOR-MANUAL GEARBOX LHD\nCab: G7–P Cabin with simple Sleeper\nWheelbase: 3900mm\nChassis frame: GERMANY MAN TGA\nEngine: MC11.43-30, 430PS, Euro III, (GERMANY MAN TECHNOLOGY)\nGear box: ZF16S2231TO, 16F&2R, manual gearbox, with ZF PTO and retarder\nSteering: BOSCH brand\nFront axle: 7000kgs disc brake\nRear axle: 13000kgs axle with drum brake single reduction\nSuspension: Front/Rear leaf springs (3//5)\nFuel tank: double tankers with capacity 860L+400L\nTire: 315/80R22.5 t",
            "fob": "$53,800",
            "shipping": "$5,900",
            "cfr": "$59,700"
          },
          {
            "model": "SITRAK-4X2牵引车 G7-P单卧铺-430马力-自动挡- 标载版-板簧悬架",
            "config": "SINOTRUK SITRAK 4x2 TRACTOR-AUTOMATIC GEARBOX LHD\nCab: G7-P Cabin with simple Sleeper\nWheelbase: 3900mm\nChassis frame: GERMANY MAN TGA\nEngine: MC11.43-30, 430PS, Euro III, (GERMANY MAN TECHNOLOGY)\nGear box: ZF12TX2621 TD, 12F&2R, automatic gearbox, with ZF PTO and retarder\nSteering: BOSCH brand\nFront axle: 7000kgs disc brake\nRear axle: 13000kgs axle with drum brake single reduction\nSuspension: Front/Rear leaf springs (3//5)\nFuel tank: double tankers with capacity 860L+400L\nTire: 315/8",
            "fob": "$57,100",
            "shipping": "$5,900",
            "cfr": "$63,000"
          },
          {
            "model": "SITRAK-4X2牵引车       G7S-P单卧铺-480马力-自动挡-标载版-板簧悬架",
            "config": "SINOTRUK SITRAK 4x2 TRACTOR-AUTOMATIC GEARBOX LHD\nCab: G7S-P Cabin with simple Sleeper\nWheelbase: 3900mm\nChassis frame: GERMANY MAN TGA\nEngine: MC13.48-30, 480PS, Euro III, (GERMANY MAN TECHNOLOGY)\nGear box: ZF12TX2621 TD, 12F&2R, automatic gearbox, with ZF PTO and retarder\nSteering: BOSCH brand\nFront axle: 7000kgs drum brake\nRear axle: 16000kgs axle with drum brake \nSuspension: Front/Rear leaf springs (3/9+6)\nFuel tank: double tankers with capacity 860L+400L\nTire: 315/80R22.5 tubeles",
            "fob": "$63,100",
            "shipping": "$5,900",
            "cfr": "$69,000"
          },
          {
            "model": "SITRAK-4X2牵引车 G7S-E双卧铺(新内饰)- 480马力-自动挡-标载版-空气悬架",
            "config": "SINOTRUK SITRAK 4x2 TRACTOR TRUCK-AUTOMATIC \nGEARBOX LHD- AIR SUSPENSION\nCab: G7S-E Cabin with double Sleepers,\nWheelbase: 3900mm\nChassis frame: GERMANY MAN TGA\nEngine: MC13.48-30, 480PS, Euro III, \n(GERMANY MAN TECHNOLOGY)\nGear box: ZF12TX2621 TD, 12F&2R, automatic gearbox, and retarder\nSteering: BOSCH brand\nFront axle: 7000kgs disc brake\nRear axle: 13000kgs axle with disc brake single reduction\nWith EBS+ESC\nSuspension: Front leaf spring and rear Air suspension\nFuel tank: double ta",
            "fob": "$64,700",
            "shipping": "$6,300",
            "cfr": "$71,000"
          }
        ],
        "6×4": [
          {
            "model": "SITRAK-6X4牵引车 G7-P 单卧铺 -手动挡-标运-板簧悬架-430CV",
            "config": "SINOTRUK SITRAK 6x4 TRACTOR-MANUAL GEARBOX LHD\nCab: G7–P Cabin with single sleeper\nWheelbase: 3600mm\nChassis frame: GERMANY MAN TGA\nEngine: MC11.43-30, 430PS, Euro III, (GERMANY MAN TECHNOLOGY)\nGear box: ZF16S2231TO, 16F&2R , manual gearbox，with ZF PTO and retarder\nSteering: BOSCH brand\nFront axle: 7000kgs disc brake\nRear axle: 13000kgs*2 axle with drum brake single reduction \nSuspension: Front/Rear leaf springs (3//5)\nFuel tank: double tankers with capacity 860L+500L\nTire: 315/80R22.",
            "fob": "$57,300",
            "shipping": "$6,700",
            "cfr": "$64,000"
          },
          {
            "model": "SITRAK-6X4牵引车 G7-P 单卧铺-手动挡-载重-板簧悬架-430CV",
            "config": "SINOTRUK SITRAK-G7 6x4 TRACTOR TRUCK LHD- Manual Gearbox- Heavy Load\nCab: G7–P Cabin with simple sleeper, with AC\nWheelbase: 3600mm\nEngine: MC11.43-30,430PS, EuroⅢ(GERMAN TECHNOLOGY)\nGear box: ZF16S2230 TO, 16F& 2R, With ZF PTO, Manual\nSteering: BOSCH brand\nFuel tank: 860L+360L\nFront axle: 9500kg (GERMAN TECHNOLOGY)，drum brake\nRear axle: 2*16000kg (GERMAN TECHNOLOGY)，drum brake\nSuspension: Front/Rear parabolic leaf springs（9/12)\nTire: 315/80R22.5 tubeless tire, With one spare tire\nTir",
            "fob": "$58,600",
            "shipping": "$6,700",
            "cfr": "$65,300"
          },
          {
            "model": "SITRAK-6X4牵引车 G7-P 单卧铺-手动挡-标运-板簧悬架-480CV",
            "config": "SINOTRUK SITRAK 6x4 TRACTOR-MANUAL GEARBOX LHD\nCab: G7–P Cabin with single sleeper\nWheelbase: 3600mm\nChassis frame: GERMANY MAN TGA\nEngine: MC13.48-30, 480PS, Euro III, (GERMANY MAN TECHNOLOGY)\nGear box: ZF16S2531TO, 16F&2R , manual gearbox，with ZF PTO and retarder\nSteering: BOSCH brand\nFront axle: 7000kgs disc brake\nRear axle: 13000kgs*2 axle with drum brake single reduction \nSuspension: Front/Rear leaf springs (3//12)\nFuel tank: double tankers with capacity 860L+500L\nTire: 315/80R22",
            "fob": "$58,500",
            "shipping": "$6,700",
            "cfr": "$65,200"
          },
          {
            "model": "SITRAK-6X4牵引车 G7-P 单卧铺-自动挡-标运-板簧悬架-480CV",
            "config": "SINOTRUK SITRAK 6X4 TRACTOR-AUTOMATIC GEARBOX LHD\nCab: G7–P Cabin with single sleeper\nWheelbase: 3600mm\nChassis frame: GERMANY MAN TGA\nEngine: MC13.48-30, 480PS, Euro III, (GERMANY MAN TECHNOLOGY)\nGear box: ZF12TX2621 TD, 12F&2R , automatic gearbox，with ZF PTO and retarder\nSteering: BOSCH brand\nFront axle: 7000kgs disc brake\nRear axle: 13000kgs*2 axle with drum brake single reduction \nSuspension: Front/Rear leaf springs (3//12)\nFuel tank: double tankers with capacity 860L+500L\nTire: 3",
            "fob": "$65,300",
            "shipping": "$6,700",
            "cfr": "$72,000"
          },
          {
            "model": "SITRAK-6X4牵引车 G7-P 单卧铺-手动挡-载重-板簧悬架-480CV",
            "config": "SINOTRUK SITRAK 6x4 TRACTOR FOR HEAVY LOAD DESERT TRANSPORTATION – MANUAL GEARBOX LHD \nCab: G7-P Cabin with simple Sleeper\nWheelbase: 3600mm\nChassis frame: Reinforced chassis-partial three-layers frame\nEngine: MC13.48-30, 480PS, Euro III, \n(GERMANY MAN TECHNOLOGY)\nGear box: ZF16S2531 TO, 16F&2R, with ZF PTO and retarder\nSteering: BOSCH brand\nFront axle: 9000kgs drum brake\n(GERMANY MAN TECHNOLOGY)\nRear axle: 16000kgs*2 drum brake double reduction\n(GERMANY MAN TECHNOLOGY)\nSuspension: F",
            "fob": "$59,600",
            "shipping": "$6,700",
            "cfr": "$66,300"
          },
          {
            "model": "SITRAK-6X4牵引车 G7-G 双卧铺-手动挡-标运-板簧悬架-480CV",
            "config": "SINOTRUK SITRAK 6x4 TRACTOR-MANUAL GEARBOX LHD\nCab:G7–G Cabin with double sleeper\nWheelbase: 3600mm\nChassis frame: GERMANY MAN TGA\nEngine: MC13.48-30, 480PS, Euro III, (GERMANY MAN TECHNOLOGY)\nGear box: ZF16S2531 TO, 16F&2R , manual gearbox，with ZF PTO and retarder\nSteering: BOSCH brand\nFront axle: 7000kgs disc brake\nRear axle: 13000kgs*2 axle with drum brake single reduction \nSuspension: Front/Rear leaf springs (3//12)\nFuel tank: double tankers with capacity 860L+500L\nTire: 315/80R22",
            "fob": "$59,100",
            "shipping": "$7,300",
            "cfr": "$66,400"
          },
          {
            "model": "SITRAK-6X4牵引车 G7-G 双卧铺-手动挡-载重-板簧悬架-480CV",
            "config": "SINOTRUK SITRAK 6x4 TRACTOR-MANUAL GEARBOX LHD\nCab:G7–G Cabin with double sleeper\nWheelbase: 3600mm\nEngine: MC13.48-30, 480PS, Euro III, (GERMANY MAN TECHNOLOGY)\nGear box: ZF16S2531 TO, 16F&2R , manual gearbox，with ZF PTO and retarder\nSteering: BOSCH brand\nFront axle: 9500kgs drum brake\nRear axle: 16000kgs*2 axle with drum brake single reduction \nSuspension: Front/Rear leaf springs (9//12)\nFuel tank: double tankers with capacity 860L+360L\nTire: 315/80R22.5 tubeless, With one spare tire",
            "fob": "$60,200",
            "shipping": "$7,300",
            "cfr": "$67,500"
          },
          {
            "model": "SITRAK-6X4牵引车 G7S-P 单卧铺-自动挡-载重-板簧悬架-480马力（新内饰）",
            "config": "SINOTRUK SITRAK G7S 6X4 TRACTOR-AUTOMATIC GEARBOX LHD\nCab: G7S-P Cabin with simple Sleeper \nChassis frame:  Reinforced chassis-partial three-layers frame\nEngine: MC13.48-30, 480PS, Euro III, (GERMANY MAN TECHNOLOGY)\nGear box:  ZF12TX2621 TD, 12F&2R , with ZF PTO and retarder\nSteering: BOSCH brand\nFront axle: 9000kgs drum brake\nRear axle: 16000kgs *2 double axle with drum brake \nSuspension: Front/Rear parabolic leaf springs（9/12）\nFuel tank: double tankers with capacity 860L+360L\nTire: 3",
            "fob": "$67,300",
            "shipping": "$6,700",
            "cfr": "$74,000"
          },
          {
            "model": "SITRAK-6X4牵引车 G7S-E 双卧铺-自动挡-载重-板簧悬架-480马力（新内饰）",
            "config": "SINOTRUK SITRAK G7S 6X4 TRACTOR-AUTOMATIC GEARBOX LHD\nCab: G7S–E Cabin with two Sleepers\nChassis frame:  Reinforced chassis-partial three-layers frame\nEngine: MC13.48-30, 480PS, Euro III, (GERMANY MAN TECHNOLOGY)\nGear box:  ZF12TX2621 TD, 12F&2R , with ZF PTO and retarder\nSteering: BOSCH brand\nFront axle: 9000kgs drum brake\nRear axle: 16000kgs *2 double axle with drum brake \nSuspension: Front/Rear parabolic leaf springs（9/12）\nFuel tank: double tankers with capacity 860L+360L\nTire: 315/",
            "fob": "$68,300",
            "shipping": "$7,600",
            "cfr": "$75,900"
          },
          {
            "model": "SITRAK-6X4牵引车 G7S-E 双卧铺-自动挡-标载-空气悬架-540马力（新内饰）",
            "config": "SINOTRUK SITRAK 6X4 TRACTOR-AUTOMATIC GEARBOX LHD\nCab: G7S-E Cabin with double sleeper\nChassis frame: GERMANY MAN TGA\nEngine: MC13.54-30,540PS, EURO III\n(GERMANY MAN TECHNOLOGY)\nGear box: ZF12TX2621 TD, 12F&2R , automatic gearbox，with ZF PTO and retarder\nSteering: BOSCH brand\nFront axle: 7000kgs disc brake\n(GERMANY MAN TECHNOLOGY)\nRear axle: 13000kgs*2 axle with drum brake single reduction\n(GERMANY MAN TECHNOLOGY) \nSuspension: Front leaf springs and rear air suspension (3/-/-)\nFuel t",
            "fob": "$67,400",
            "shipping": "$7,600",
            "cfr": "$75,000"
          },
          {
            "model": "SITRAK-6X4牵引车 G7S-E 双卧铺-自动挡-标载-钢板悬架-540马力（新内饰）",
            "config": "SINOTRUK SITRAK 6X4 TRACTOR-AUTOMATIC GEARBOX\nLHD\nCab: G7S-E Cabin with double sleeper\nChassis frame: GERMANY MAN TGA\nEngine: MC13.54-30,540PS, EUROIll\n'GERMANY MAN TECHNOLOGY)\nGear box: ZF12TX2621 TD,12F&2R, automatic gearbox,\nwith ZF PTO and retarder \nSteering: BOSCH brand\nFront axle: 7000kgs disc brake\n'GERMANY MAN TECHNOLOGY)\nRear axle: 13000kgs*2 axle with drum brake single reduction\n'GERMANY MAN TECHNOLOGY)\nsuspension: Front/Rear parabolic leaf springs (3/5)\nFuel tank: double",
            "fob": "$66,400",
            "shipping": "$7,600",
            "cfr": "$74,000"
          }
        ]
      },
      "自卸车": {
        "6×4": [
          {
            "model": "SITRAK-6X4 自卸车 G7-P-单卧铺-手动挡-重载-板簧悬架-430马力",
            "config": "SINOTRUK SITRAK 6X4 TIPPER TRUCK LHD-MANUAL GEARBOX\nCab: G7–M Cabin with one small sleeper\nWheelbase: 3600mm\nEngine: MC11.43-30, 430PS, Euro III \n(GERMAN MAN TECHNOLOGY)\nGear box: ZF16S2230 TO, 16F&2R, manual gearbox ，with ZF PTO \nSteering: BOSCH brand\nFront axle: 9500kg, drum brake\n(GERMAN MAN TECHNOLOGY)\nRear axle:16000kg*2, drum brake, double reduction\n(GERMAN MAN TECHNOLOGY)\nFuel tank: 400L\nTire: 315/80R22.5 tubeless, With one spare tire\nTire brand：GOODYEAR\nTipper body: \nHYVA ",
            "fob": "$60,800",
            "shipping": "$7,900",
            "cfr": "$68,700"
          }
        ],
        "8×4": [
          {
            "model": "SITRAK-8X4 自卸车 G7-P-单卧铺-手动挡-重载-板簧悬架-430马力",
            "config": "SINOTRUK SITRAK 8X4 TIPPER TRUCK LHD-MANUAL GEARBOX\nCab: G7–M Cabin with one small sleeper\nWheelbase: 3000mm\nEngine: MC11.43-30, 430PS, Euro III\n(MAN TECHNOLOGY)\nGear box: ZF16S2230TO 16F&2R, manual gearbox, With synchronizer, with ZF PTO\nSteering: BOSCH brand\nFront axle: 9500kg*2, drum brake\n(MAN TECHNOLOGY)\nRear axle:16000kg*2, drum brake, double reduction \n(MAN TECHNOLOGY)\nTire: 315/80R22.5 tubeless, With one spare tire\nTire brand: GOODYEAR brand\nFuel tank: 400L\nTipper body: \nH",
            "fob": "$62,400",
            "shipping": "$9,100",
            "cfr": "$71,500"
          },
          {
            "model": "\"SITRAK-8X4 自卸车 G7-P-单卧铺-自动挡-重载-板簧悬架-480马力\"",
            "config": "SINOTRUK SITRAK 8X4 TIPPER TRUCKLHD-AUTOMATIC GEARBOXCab:G7-MCabin with one small sleeper[Wheelbase:3200mmEngine:MC13.48-30,480PS,EuroIlMANTECHNOLOGY)\nGeurbox-ZF12TX2621TDAutomnticgearbox,Withsynchronizer, with\nZF PTO WTTH RETARDER\nSteering:BOSCH bmndFront axle:9500kg*2,drum brake(MANTECHNOLOGY\nRear axle: 16000kg*2,drum brnke,double reductionMANTECHNOLOGY)\nTire: 1 3R22,$tubeless,With one spare tireFuel tank:400L\nTipper body: HYVA front lifing cylinder BodySize:6500x2350x1650mm",
            "fob": "$69,600",
            "shipping": "$9,900",
            "cfr": "$79,500"
          }
        ]
      },
      "搅拌车": {
        "6×4": [
          {
            "model": "SITRAK-6X4 搅拌车 G7-P-单卧铺-手动挡-重载-板簧悬架-430马力",
            "config": "SINOTRUK SITRAK 6X4 MIXER TRUCK LHD-MANUAL GEARBOX\nCab: G7–M Cabin with one small sleeper\nWheelbase: 3800mm\nEngine: MC11.43-30, 430PS, Euro III \n(GERMAN MAN TECHNOLOGY)\nGear box: ZF16S2230 TO, 16F&2R, manual gearbox ，with ZF PTO \nSteering: BOSCH brand\nFront axle: 9500kg, drum brake\n(GERMAN MAN TECHNOLOGY)\nRear axle:16000kg*2, drum brake, double reduction\n(GERMAN MAN TECHNOLOGY)\nFuel tank: 400L\nTire: 315/80R22.5 tubeless, With one spare tire\nTire brand：GOODYEAR \nOthers：\nWith A/C, \\",
            "fob": "$65,600",
            "shipping": "$10,100",
            "cfr": "$75,700"
          }
        ],
        "8×4": [
          {
            "model": "SITRAK-8X4 搅拌车 G7-P-单卧铺-手动挡-重载-板簧悬架-430马力",
            "config": "SINOTRUK SITRAK 8X4 MIXER TRUCK LHD-MANUAL GEARBOX\nCab: G7-M, with one small sleeper\nWheelbase: 3000mm\nEngine: MC11.43-30, 430PS, Euro III emission, with PTO\n(GERMAN MAN TECHNOLOGY)\nGearBox: ZF16S2230TO, 16F&2R, manual gearbox,, with Synchronizer\nSteering: BOSCH brand\nFront axle: 9500kg*2, drum brake \n(GERMAN MAN TECHNOLOGY)\nRear axle:16000kg*2, drum brake, double reduction \n(GERMAN MAN TECHNOLOGY)\nTire: 315/80R22.5 tubeless, with one spare tire\nTire brand: GOODYEAR brand\nFuel tank:",
            "fob": "$69,600",
            "shipping": "$11,100",
            "cfr": "$80,700"
          }
        ]
      }
    }
  }
};;

// =================== DATA: Quick replies (code-based, multilingual) ===================
var DEFAULT_REPLIES = [
  {code:'1',name:'111你好先生，我是来自中国的li，很高兴认识你，请问你怎么称呼？想要购买什么卡车？',en:'Hello sir, this is Li from China. Nice to meet you. May I know your name? What type of truck are you looking for?',fr:'Bonjour monsieur, je suis Li de Chine. Ravi de faire votre connaissance. Puis-je connaître votre nom ? Quel type de camion recherchez-vous ?',ar:'مرحباً سيدي، أنا لي من الصين. تشرفت بمعرفتك. هل يمكنني معرفة اسمك؟ وما نوع الشاحنة التي تبحث عنها؟'},
  {code:'4',name:'112早上好先生',en:'Good morning, sir.',fr:'Bonjour monsieur.',ar:'صباح الخير يا سيدي.'},
  {code:'7',name:'113下午好先生',en:'Good afternoon, sir.',fr:'Bon après-midi monsieur.',ar:'مساء الخير يا سيدي.'},
  {code:'10',name:'114晚上好先生',en:'Good evening, sir.',fr:'Bonsoir monsieur.',ar:'مساء الخير يا سيدي.'},
  {code:'13',name:'115你好先生',en:'Hello sir.',fr:'Bonjour monsieur.',ar:'مرحباً يا سيدي.'},
  {code:'16',name:'116愿你平安，先生',en:'May you be safe and well, sir.',fr:'Que la paix soit avec vous, monsieur.',ar:'أتمنى لك السلامة، يا سيدي.'},
  {code:'19',name:'117好久不见，我的朋友',en:'Ça fait longtemps qu’on ne s’est pas vu, mon ami.',fr:'',ar:'لم أرك منذ زمن طويل، يا صديقي.'},
  {code:'22',name:'118最近还好吗？我的朋友',en:'How have you been lately? My friend.',fr:'Bonjour monsieur, comment allez-vous ces derniers temps ?',ar:'مرحباً يا سيدي، كيف حالك مؤخراً؟'},
  {code:'25',name:'119你好先生，你最近怎么样？',en:'Hello sir, how have you been lately?',fr:'Bonjour monsieur, comment allez-vous ces derniers temps ?',ar:'مرحباً يا سيدي، كيف حالك مؤخراً؟'},
  {code:'28',name:'120你好朋友，最近还好吗？',en:'Hello my friend, how have you been lately?',fr:'Bonjour mon ami, comment vas-tu ces derniers temps ?',ar:'مرحباً يا صديقي، كيف حالك مؤخراً؟'},
  {code:'31',name:'121好久不见，我的朋友，你最近好吗？',en:'Ça fait longtemps qu’on ne s’est pas vu, mon ami. Comment vas-tu ces derniers temps ?',fr:'',ar:'لم أرك منذ زمن طويل، يا صديقي. كيف حالك مؤخراً؟'},
  {code:'34',name:'122先生，请问你来自那个国家？',en:'Sir, may I ask which country you are from?',fr:'Monsieur, puis-je vous demander de quel pays vous venez ?',ar:'سيدي، هل يمكنني أن أسأل من أي دولة أنت؟'},
  {code:'37',name:'123很高兴认识你，先生，你想咨询哪款卡车？',en:'Nice to meet you, sir. Which model of truck would you like to inquire about?',fr:'Ravi de vous rencontrer, monsieur. Quel modèle de camion souhaitez-vous consulter ?',ar:'سعيد بلقائك، يا سيدي. أي طراز من الشاحنات تريد الاستفسار عنه؟'},
  {code:'40',name:'124先生，您需要什么类型卡车？用来运输什么货物？大概运输多少吨？',en:'Sir, what type of truck do you need? What kind of goods will it be used to transport? Approximately how many tons?',fr:'Monsieur, quel type de camion avez-vous besoin ? Pour transporter quel type de marchandises ? Environ combien de tonnes ?',ar:'سيدي، ما نوع الشاحنة التي تحتاجها؟ لنقل أي نوع من البضائع؟ تقريباً كم طن؟'},
  {code:'43',name:'125先生，你在阿尔及利亚那个城市？',en:'Sir, which city in Algeria are you in?',fr:'Monsieur, dans quelle ville d’Algérie êtes-vous ?',ar:'سيدي، في أي مدينة في الجزائر أنت؟'},
  {code:'46',name:'126先生，你主要从事物流运输吗？',en:'Sir, do you mainly engage in logistics and transportation?',fr:'Monsieur, exercez-vous principalement dans le domaine du transport et de la logistique ?',ar:'سيدي، هل تعمل بشكل أساسي في مجال النقل واللوجستيات؟'},
  {code:'49',name:'127先生，你运输的货物是从那个城市到那个城市？',en:'Sir, from which city to which city do you transport your goods?',fr:'Monsieur, les marchandises que vous transportez vont de quelle ville à quelle ville ?',ar:'سيدي، البضائع التي تنقلها من أي مدينة إلى أي مدينة؟'},
  {code:'52',name:'128先生，你现在开的是那个品牌的卡车？',en:'Sir, what brand of truck are you currently driving?',fr:'Monsieur, quelle marque de camion conduisez-vous actuellement ?',ar:'سيدي، ما هي علامة الشاحنة التي تقودها حالياً؟'},
  {code:'55',name:'129先生，你购买卡车，主要运输什么货物？',en:'Sir, when you buy a truck, what kind of goods do you mainly transport?',fr:'Monsieur, lorsque vous achetez un camion, quel type de marchandises transportez-vous principalement ?',ar:'سيدي، عندما تشتري شاحنة، ما نوع البضائع التي تنقلها بشكل أساسي؟'},
  {code:'58',name:'130先生，你从中国购买过卡车吗？或者其他国家购买过吗？',en:'Sir, have you ever bought trucks from China? Or from other countries?',fr:'Monsieur, avez-vous déjà acheté des camions en Chine ? Ou dans d’autres pays ?',ar:'سيدي، هل اشتريت شاحنات من الصين من قبل؟ أو من دول أخرى؟'},
  {code:'61',name:'131先生你想咨询牵引车吗？',en:'Sir, would you like to purchase a tractor?',fr:'Monsieur, voulez - vous acheter un tracteur?',ar:'هل ترغب في شراء جرار ، سيدي ؟'},
  {code:'64',name:'132先生你想要购买4x2牵引车还是6x4牵引车？选择手动挡还是自动挡？',en:'Sir, do you want to buy a 4x2 tractor truck or a 6x4 tractor truck? Do you prefer manual transmission or automatic?',fr:'Monsieur, voulez-vous acheter un tracteur 4x2 ou un tracteur 6x4 ? Préférez-vous une boîte manuelle ou automatique ?',ar:'سيدي، هل تريد شراء جرار 4x2 أم جرار 6x4؟ هل تفضل ناقل حركة يدوي أم أوتوماتيكي؟'},
  {code:'67',name:'133先生，你想购买多少台牵引车？',en:'Sir, how many tractor trucks do you want to purchase?',fr:'Monsieur, combien de tracteurs routiers souhaitez-vous acheter ?',ar:'سيدي، كم عدد الجرارات التي تريد شراءها؟'},
  {code:'70',name:'134先生你想咨询自卸车吗？',en:'Sir, would you like to inquire about dump trucks?',fr:'Monsieur, souhaitez-vous des informations sur les camions-bennes ?',ar:'سيدي، هل تريد الاستفسار عن شاحنات التفريغ (القلاب)؟'},
  {code:'73',name:'135先生你想要购买6x4自卸车还是8x4自卸车？',en:'Sir, do you want to buy a 6x4 dump truck or an 8x4 dump truck?',fr:'Monsieur, voulez-vous acheter un camion-benne 6x4 ou un camion-benne 8x4 ?',ar:'سيدي، هل تريد شراء شاحنة قلاب 6x4 أم 8x4؟'},
  {code:'76',name:'136先生，你想购买多少台自卸车？',en:'Sir, how many dump trucks do you want to purchase?',fr:'Monsieur, combien de camions-bennes souhaitez-vous acheter ?',ar:'سيدي، كم عدد شاحنات التفريغ التي تريد شراءها؟'},
  {code:'79',name:'137先生你想咨询轻卡吗？',en:'Sir, would you like to inquire about light trucks?',fr:'Monsieur, souhaitez-vous des informations sur les camions légers ?',ar:'سيدي، هل تريد الاستفسار عن الشاحنات الخفيفة؟'},
  {code:'82',name:'138先生你想要购买几吨的轻卡？用来运输什么货物？对于货箱长度你有什么要求？',en:'Sir, what tonnage of light truck do you want to buy? What kind of goods will it transport? Do you have any requirements for the cargo box length?',fr:'Monsieur, quelle capacité en tonnes de camion léger voulez-vous acheter ? Pour transporter quel type de marchandises ? Avez-vous des exigences concernant la longueur de la caisse ?',ar:'سيدي، كم طن الشاحنة الخفيفة التي تريد شراءها؟ لنقل أي نوع من البضائع؟ هل لديك متطلبات حول طول صندوق الشحن؟'},
  {code:'85',name:'139先生，你想购买多少台轻卡？',en:'Sir, how many light trucks do you want to purchase?',fr:'Monsieur, combien de camions légers souhaitez-vous acheter ?',ar:'سيدي، كم عدد الشاحنات الخفيفة التي تريد شراءها؟'},
  {code:'88',name:'140先生，你想购买多少台载货车？',en:'Sir, how many cargo trucks do you want to purchase?',fr:'Monsieur, combien de camions de fret souhaitez-vous acheter ?',ar:'سيدي، كم عدد شاحنات الشحن التي تريد شراءها؟'},
  {code:'91',name:'141先生你想咨询随车吊吗？',en:'Sir, would you like to inquire about truck-mounted cranes?',fr:'Monsieur, souhaitez-vous des informations sur les camions-grues ?',ar:'سيدي، هل تريد الاستفسار عن الرافعات المثبتة على الشاحنات؟'},
  {code:'94',name:'142先生你想要几吨的随车吊？我们有8吨和12吨的随车吊。',en:'Sir, what tonnage of truck-mounted crane do you want? We have 8-ton and 12-ton truck-mounted cranes.',fr:'Monsieur, quelle capacité en tonnes de grue sur camion voulez-vous ? Nous avons des grues de 8 tonnes et 12 tonnes.',ar:'سيدي، كم طن الرافعة المثبتة على الشاحنة التي تريد؟ لدينا رافعات 8 طن و12 طن.'},
  {code:'97',name:'143先生，你想购买多少台随车吊？',en:'Sir, how many truck-mounted cranes do you want to purchase?',fr:'Monsieur, combien de camions-grues souhaitez-vous acheter ?',ar:'سيدي، كم عدد الرافعات المثبتة على الشاحنات التي تريد شراءها؟'},
  {code:'100',name:'144先生你想咨询水罐车吗？',en:'Sir, would you like to inquire about water tanker trucks?',fr:'Monsieur, souhaitez-vous des informations sur les camions-citernes à eau ?',ar:'سيدي، هل تريد الاستفسار عن شاحنات صهاريج المياه؟'},
  {code:'103',name:'145先生你想要运输多少立方的水罐车？我们有12立方和22立方的水罐车。',en:'Sir, how many cubic meters of water tanker do you need? We have 12m³ and 22m³ water tankers.',fr:'Monsieur, quelle capacité en mètres cubes de camion-citerne à eau voulez-vous ? Nous avons des citernes de 12 m³ et 22 m³.',ar:'سيدي، كم متر مكعب صهريج المياه الذي تريد؟ لدينا صهاريج 12 م³ و22 م³.'},
  {code:'106',name:'146先生，你想购买多少台水罐车？',en:'Sir, how many water tanker trucks do you want to purchase?',fr:'Monsieur, combien de camions-citernes à eau souhaitez-vous acheter ?',ar:'سيدي، كم عدد شاحنات صهاريج المياه التي تريد شراءها؟'},
  {code:'109',name:'147先生你想咨询油罐车吗？',en:'Sir, would you like to inquire about fuel/oil tanker trucks?',fr:'Monsieur, souhaitez-vous des informations sur les camions-citernes à carburant ?',ar:'سيدي، هل تريد الاستفسار عن شاحنات صهاريج الوقود؟'},
  {code:'112',name:'148先生你想要运输多少立方的油罐车？我们有12立方和22立方的油罐车。',en:'Sir, how many cubic meters of tanker trucks do you want to transport? We have 12m³ and 22m³ tanker trucks.',fr:'Monsieur, combien de camions-citernes en mètres cubes souhaitez-vous transporter ? Nous avons des camions-citernes de 12m³ et 22m³.',ar:'سيدي، كم عدد شاحنات الصهاريج بالمتر المكعب التي تريد نقلها؟ لدينا شاحنات صهاريج بسعة 12 متر³ و22 متر³.'},
  {code:'115',name:'149先生，你想购买多台油罐车？',en:'Sir, how many tanker trucks do you want to purchase?',fr:'Monsieur, combien de camions-citernes souhaitez-vous acheter ?',ar:'سيدي، كم عدد شاحنات الصهاريج التي تريد شرائها؟'},
  {code:'118',name:'150先生你想咨询搅拌车吗？',en:'Sir, do you want to inquire about mixer trucks?',fr:'Monsieur, voulez-vous vous renseigner sur les camions malaxeurs ?',ar:'سيدي، هل تريد الاستفسار عن شاحنات الخلاط؟'},
  {code:'121',name:'151先生，搅拌车有10立方和12立方，你想购买哪一款？',en:'Sir, mixer trucks come in 10m³ and 12m³. Which one would you like to purchase?',fr:'Monsieur, les camions malaxeurs existent en 10m³ et 12m³. Lequel souhaitez-vous acheter ?',ar:'سيدي، شاحنات الخلاط متوفرة بسعة 10 متر³ و12 متر³، أي واحد ترغب في شرائه؟'},
  {code:'124',name:'152先生，你想购买多少台搅拌车？',en:'Sir, how many mixer trucks do you want to purchase?',fr:'Monsieur, combien de camions malaxeurs souhaitez-vous acheter ?',ar:'سيدي، كم عدد شاحنات الخلاط التي تريد شرائها؟'},
  {code:'127',name:'153先生，你想购买这个卡车底盘吗？',en:'Sir, do you want to purchase this truck chassis?',fr:'Monsieur, voulez-vous acheter ce châssis de camion ?',ar:'سيدي، هل ترغب في شراء هيكل هذه الشاحنة؟'},
  {code:'130',name:'154先生，对于卡车你还有其他的要求吗？是否加装一些其他的配件？',en:'Sir, do you have any other requirements for the truck? Do you want to add any other accessories?',fr:'Monsieur, avez-vous d\'autres exigences pour le camion ? Voulez-vous ajouter d\'autres accessoires ?',ar:'سيدي، هل لديك أي متطلبات أخرى للشاحنة؟ هل ترغب في إضافة أي ملحقات أخرى؟'},
  {code:'133',name:'155先生，牵引车你想要多大马力？我们有430马力，480马力和540马力',en:'Sir, how much horsepower do you want for the tractor? We have 430 horsepower, 480 horsepower, and 540 horsepower',fr:'Monsieur, quelle puissance voulez - vous pour le tracteur? Nous avons 430 CH, 480 ch et 540 ch',ar:'كم حصان هل تريد جرار ، سيدي ؟ لدينا 430 حصان ، 480 حصان و 540 حصان .'},
  {code:'136',name:'156先生，请稍等，我给你发卡车的具体配置和价格。',en:'Sir, please wait a moment, I will send you the detailed configuration and price of the truck.',fr:'Monsieur, veuillez patienter un instant, je vais vous envoyer la configuration détaillée et le prix du camion.',ar:'سيدي، يرجى الانتظار قليلاً، سأرسل لك التكوين التفصيلي وسعر الشاحنة.'},
  {code:'139',name:'157先生，卡车生产大概需要35天左右。但是你的订单，我一定会尽快催促，保证让你尽快见到你的卡车。',en:'Sir, the truck production takes about 35 days. But for your order, I will urge it as soon as possible to ensure you can see your truck quickly.',fr:'Monsieur, la production du camion prend environ 35 jours. Mais pour votre commande, je vais la suivre rapidement afin que vous puissiez voir votre camion dès que possible.',ar:'سيدي، تستغرق عملية إنتاج الشاحنة حوالي 35 يومًا. لكن طلبك سأحرص على تسريعه لضمان أن ترى شاحنتك في أسرع وقت ممكن.'},
  {code:'142',name:'158先生，卡车的运输大概需要30天左右，可以到达目的港。',en:'Sir, the transportation of the truck takes about 30 days and can reach the destination port.',fr:'Monsieur, le transport du camion prend environ 30 jours et peut atteindre le port de destination.',ar:'سيدي، تستغرق عملية نقل الشاحنة حوالي 30 يومًا ويمكن أن تصل إلى ميناء الوجهة.'},
  {code:'145',name:'159先生，卡车生产需要35天左右，海上运输大概需要30天左右。一共大约需要70天可以送达你的港口。',en:'Sir, truck production takes about 35 days, and sea transportation takes about 30 days. It will take about 70 days in total to deliver to your port.',fr:'Monsieur, la production du camion prend environ 35 jours et le transport maritime environ 30 jours. Il faudra environ 70 jours au total pour livrer à votre port.',ar:'سيدي، تستغرق عملية إنتاج الشاحنة حوالي 35 يومًا، والنقل البحري حوالي 30 يومًا. الإجمالي حوالي 70 يومًا للوصول إلى ميناءك.'},
  {code:'148',name:'160先生，我们下完单以后，工厂需要排产，做生产计划，采购必须的配件，真正生产一天就可以完成了。',en:'Sir, after we place the order, the factory needs to schedule production, make a production plan, and procure necessary parts. Actual production can be completed in one day.',fr:'Monsieur, après avoir passé la commande, l\'usine doit planifier la production, établir un plan de production et se procurer les pièces nécessaires. La production réelle peut être terminée en un jour.',ar:'سيدي، بعد تقديم الطلب، يحتاج المصنع إلى جدولة الإنتاج، ووضع خطة الإنتاج، وشراء الأجزاء اللازمة. يمكن الانتهاء من الإنتاج الفعلي في يوم واحد.'},
  {code:'151',name:'161先生，卡车生产完毕以后，我会给你发照片和视频，方便你查看。',en:'Sir, after the truck is produced, I will send you photos and videos for your reference.',fr:'Monsieur, une fois le camion produit, je vous enverrai des photos et vidéos pour votre référence.',ar:'سيدي، بعد إنتاج الشاحنة سأرسل لك صورًا وفيديوهات لتتمكن من الاطلاع عليها.'},
  {code:'154',name:'162先生，下单以后，我会催促生产尽快完成你的卡车，保证你的卡车尽快生产完成。',en:'Sir, after placing the order, I will urge production to complete your truck as soon as possible, ensuring your truck is produced quickly.',fr:'Monsieur, après avoir passé la commande, je vais accélérer la production pour que votre camion soit produit rapidement.',ar:'سيدي، بعد تقديم الطلب سأحرص على تسريع إنتاج شاحنتك لضمان إكمال الإنتاج بسرعة.'},
  {code:'157',name:'163先生，发往阿尔及利亚的船大部分是散货船，所以我们运输一般也都是散货船，滚装船很少，而且海运价格会更高。',en:'Sir, most ships sent to Algeria are bulk carriers, so our transportation is generally also by bulk ship. Ro-Ro ships are rare, and sea freight is more expensive.',fr:'Monsieur, la plupart des navires envoyés en Algérie sont des vraquiers, donc notre transport se fait généralement aussi par vraquier. Les navires roulants sont rares et le fret maritime est plus cher.',ar:'سيدي، معظم السفن المتجهة إلى الجزائر هي سفن بضائع سائبة، لذلك نقلنا يتم عادة بنفس الطريقة، السفن الدحرجة قليلة، وتكلفة الشحن البحري أعلى.'},
  {code:'160',name:'164先生，现在运输卡车都是达到阿尔及利亚杰恩杰恩港口，其他港口只能发框架，而且海运费会跟高。大概三倍的运费。',en:'Currently, trucks are transported to Djendjen Port in Algeria. Other ports can only ship as CKD (knocked down), and sea freight will be higher, about three times the cost.',fr:'Actuellement, les camions sont transportés au port de Djendjen en Algérie. Les autres ports ne peuvent expédier qu\'en CKD, et le fret maritime sera plus élevé, environ trois fois le coût.',ar:'سيدي ، الآن شاحنات النقل تصل إلى ميناء جنين في الجزائر ، والموانئ الأخرى يمكن أن ترسل فقط في إطار الشحن البحري سوف تكون عالية . حوالي ثلاثة أضعاف تكلفة الشحن .'},
  {code:'163',name:'165抱歉先生，卡车无法运输到其他港口，只能到杰恩杰恩港口，其他港口船很少，而且价格很贵。',en:'Sorry sir, the truck cannot be transported to other ports, only to Djendjen Port. Other ports have few ships and the cost is high.',fr:'Désolé monsieur, le camion ne peut pas être transporté vers d\'autres ports, uniquement au port de Djendjen. Les autres ports ont peu de navires et le coût est élevé.',ar:'عذرًا سيدي، لا يمكن نقل الشاحنة إلى الموانئ الأخرى، فقط إلى ميناء جندجان، والموانئ الأخرى بها سفن قليلة والتكلفة مرتفعة.'},
  {code:'166',name:'166是的先生，我们在阿尔及尔/奥兰还有赛提夫都有办公室，如果需要的话，我可以安排人联系你。',en:'Yes sir, we have offices in Algiers/Oran and Setif. If needed, I can arrange someone to contact you.',fr:'Oui monsieur, nous avons des bureaux à Alger/Oran et Sétif. Si nécessaire, je peux organiser qu\'on vous contacte.',ar:'نعم سيدي، لدينا مكاتب في الجزائر/وهران وسطيف، إذا لزم الأمر يمكنني ترتيب اتصال شخص ما بك.'},
  {code:'169',name:'167先生，我们在阿尔及利亚有很多服务站，我们在奥兰和赛提夫还有巴特那有专门的维修售后服务站。',en:'Sir, we have many service stations in Algeria, and we have dedicated after-sales service stations in Oran, Setif, and Batna.',fr:'Monsieur, nous avons de nombreuses stations de service en Algérie et nous avons des stations de service après-vente dédiées à Oran, Sétif et Batna.',ar:'سيدي، لدينا العديد من محطات الخدمة في الجزائر، ولدينا محطات صيانة وخدمة مخصصة في وهران وسطيف وباتنة.'},
  {code:'172',name:'168先生，我们中国的办公室是在山东济南市，如果你有时间的话，欢迎来我们工厂办公室参观。',en:'Sir, our office in China is in Jinan, Shandong. If you have time, you are welcome to visit our factory office.',fr:'Monsieur, notre bureau en Chine est à Jinan, Shandong. Si vous avez le temps, vous êtes le bienvenu pour visiter notre usine.',ar:'سيدي، مكتبنا في الصين موجود في جينان، شاندونغ. إذا كان لديك وقت، نرحب بزيارتك لمكتب المصنع.'},
  {code:'175',name:'169先生我们是一家中国公司，我们公司在中国，卡车在中国生产。然后通过海运的方式运输到目的港港口',en:'Sir, we are a Chinese company. Our company is in China, and the trucks are produced in China. They are then shipped to the destination port by sea.',fr:'Nous sommes une entreprise chinoise. Notre société est en Chine et les camions sont produits en Chine. Ils sont ensuite expédiés par mer au port de destination.',ar:'نحن شركة صينية، شركتنا في الصين والشاحنات تصنع في الصين. ثم يتم شحنها إلى ميناء الوجهة عن طريق البحر.'},
  {code:'178',name:'170先生，你打算什么时候来中国参观我们的工厂？',en:'Sir, when do you plan to visit our factory in China?',fr:'Monsieur, quand prévoyez-vous de visiter notre usine en Chine ?',ar:'سيدي، متى تخطط لزيارة مصنعنا في الصين؟'},
  {code:'181',name:'171可以的先生，我们可以给你提供邀请函，方便你申请签证。',en:'Yes sir, we can provide you with an invitation letter to facilitate your visa application.',fr:'Oui monsieur, nous pouvons vous fournir une lettre d\'invitation pour faciliter votre demande de visa.',ar:'نعم سيدي، يمكننا تزويدك برسالة دعوة لتسهيل طلب التأشيرة الخاص بك.'},
  {code:'184',name:'172先生，请把你的护照发给我，方便我给你开具邀请函来中国参观。',en:'Sir, please send me your passport so that I can issue an invitation letter for you to visit China.',fr:'Monsieur, veuillez m\'envoyer votre passeport afin que je puisse vous délivrer une lettre d\'invitation pour visiter la Chine.',ar:'سيدي، يرجى إرسال جواز سفرك لي حتى أتمكن من إصدار رسالة دعوة لك لزيارة الصين.'},
  {code:'187',name:'173先生，这是你的邀请函，有什么问题可以随时联系我。',en:'Sir, this is your invitation letter. You can contact me anytime if you have any questions.',fr:'Monsieur, voici votre lettre d\'invitation. Vous pouvez me contacter à tout moment si vous avez des questions.',ar:'سيدي، هذه هي رسالة الدعوة الخاصة بك، يمكنك الاتصال بي في أي وقت إذا كان لديك أي استفسارات.'},
  {code:'190',name:'174先生，我们收到信用证70个工作日内就可以交付卡车，运输到你的目的港。',en:'Sir, we can deliver the trucks within 70 working days after receiving the letter of credit, and ship them to your destination port.',fr:'Monsieur, nous pouvons livrer les camions dans les 70 jours ouvrables après réception de la lettre de crédit et les expédier à votre port de destination.',ar:'سيدي، يمكننا تسليم الشاحنات خلال 70 يوم عمل بعد استلام خطاب الاعتماد وشحنها إلى ميناء الوجهة الخاص بك.'},
  {code:'193',name:'175抱歉先生，我们只能把卡车运送到目的港，我们无法帮你清关，建议你可以找目的港的代理商，他们可以更好的帮助你。',en:'Sorry sir, we can only transport the trucks to the destination port. We cannot help with customs clearance. We suggest you find an agent at the port who can assist you better.',fr:'Désolé monsieur, nous ne pouvons transporter les camions qu\'au port de destination. Nous ne pouvons pas vous aider pour le dédouanement. Nous vous suggérons de trouver un agent au port qui peut mieux vous aider.',ar:'عذرًا سيدي، يمكننا نقل الشاحنات فقط إلى ميناء الوجهة، ولا يمكننا مساعدتك في التخليص الجمركي. ننصحك بالبحث عن وكيل في الميناء لمساعدتك بشكل أفضل.'},
  {code:'196',name:'176抱歉先生，我听不懂你的语音，请你打字告诉我你的需求，感谢你的理解。',en:'Sorry sir, I don’t understand your voice message. Please type your request. Thank you for your understanding.',fr:'Désolé monsieur, je ne comprends pas votre message vocal. Veuillez taper votre demande. Merci pour votre compréhension.',ar:'عذرًا سيدي، لا أفهم رسالتك الصوتية، يرجى كتابة طلبك، شكرًا لتفهمك.'},
  {code:'199',name:'177抱歉先生，我没有理解你的意思，麻烦你再重新说下，感谢你的理解。',en:'Sorry sir, I did not understand your meaning. Please explain again. Thank you for your understanding.',fr:'Désolé monsieur, je n\'ai pas compris votre signification. Veuillez répéter. Merci pour votre compréhension.',ar:'عذرًا سيدي، لم أفهم قصدك، يرجى إعادة الشرح، شكرًا لتفهمك.'},
  {code:'202',name:'178抱歉先生，我们现在已经下班了，上班以后我会把资料发给你，感谢你的理解',en:'Sorry sir, we have finished work for today. I will send you the information after work. Thank you for your understanding.',fr:'Désolé monsieur, nous avons terminé le travail pour aujourd\'hui. Je vous enverrai les informations après le travail. Merci pour votre compréhension.',ar:'عذرًا سيدي، لقد انتهينا من العمل الآن، سأرسل لك المعلومات بعد العودة للعمل، شكرًا لتفهمك.'},
  {code:'205',name:'179抱歉先生，不能使用阿尔及利亚第纳尔货币付款，只能使用信用证付款，或者国际电汇付款。',en:'Sorry sir, payment cannot be made in Algerian Dinar. Only L/C or international wire transfer is accepted.',fr:'Désolé monsieur, le paiement ne peut pas être effectué en dinar algérien. Seuls la lettre de crédit ou le virement international sont acceptés.',ar:'عذرًا سيدي، لا يمكن الدفع بالدينار الجزائري، يمكن الدفع فقط عن طريق خطاب اعتماد أو تحويل دولي.'},
  {code:'208',name:'180抱歉先生，我们没有二手的卡车，我们只出售新车，中国的二手卡车不太适合非洲市场的排放标准，车辆很容易出问题。',en:'Sorry sir, we don’t sell used trucks. We only sell new trucks. Chinese used trucks are not suitable for African emission standards and are prone to problems.',fr:'Désolé monsieur, nous ne vendons pas de camions d\'occasion. Nous ne vendons que des camions neufs. Les camions d\'occasion chinois ne conviennent pas aux normes d\'émission africaines et sont sujets à des problèmes.',ar:'عذرًا سيدي، لا نبيع شاحنات مستعملة، نبيع فقط شاحنات جديدة. الشاحنات الصينية المستعملة غير مناسبة لمعايير الانبعاث في إفريقيا وسهلة التعطل.'},
  {code:'211',name:'181先生，中国的二手卡车是欧五和欧六的排放标准，在非洲使用很容易出问题，速度也只有20迈。速度无法提高。',en:'Sir, Chinese used trucks meet Euro 5 and Euro 6 emission standards. Using them in Africa can easily cause problems, and the speed is only 20 mph, which cannot be increased.',fr:'Monsieur, les camions d\'occasion chinois respectent les normes Euro 5 et Euro 6. Les utiliser en Afrique peut facilement causer des problèmes et leur vitesse est limitée à 20 mph.',ar:'سيدي، الشاحنات الصينية المستعملة تتوافق مع معايير الانبعاث يورو 5 ويورو 6. استخدامها في إفريقيا قد يسبب مشاكل بسهولة، والسرعة 20 ميل في الساعة فقط ولا يمكن زيادتها.'},
  {code:'214',name:'182先生，我们出售的全新卡车都是有质保的，有一年或者10万公里的质保，卡车可以放心使用。',en:'Sir, all our new trucks come with a warranty of one year or 100,000 km, so you can use the trucks with confidence.',fr:'Monsieur, tous nos camions neufs sont garantis un an ou 100 000 km, vous pouvez donc utiliser les camions en toute confiance.',ar:'سيدي، جميع الشاحنات الجديدة التي نبيعها تأتي مع ضمان لمدة سنة أو 100,000 كم، لذا يمكنك استخدام الشاحنات بثقة.'},
  {code:'217',name:'183好的，我明白了先生',en:'Okay, I understand sir.',fr:'D\'accord, je comprends monsieur.',ar:'حسنًا، فهمت سيدي.'},
  {code:'220',name:'184先生，你能给我发一张你想购买卡车的图片吗？方便我理解。',en:'Sir, could you send me a picture of the truck you want to purchase? It will help me understand.',fr:'Monsieur, pourriez-vous m\'envoyer une photo du camion que vous souhaitez acheter ? Cela m\'aidera à comprendre.',ar:'سيدي، هل يمكنك إرسال صورة للشاحنة التي ترغب في شرائها؟ سيساعدني ذلك على الفهم.'},
  {code:'223',name:'185好的先生，我等你的消息。',en:'Okay sir, I will wait for your message.',fr:'D\'accord monsieur, j\'attendrai votre message.',ar:'حسنًا سيدي، سأنتظر رسالتك.'},
  {code:'226',name:'186你好先生，我现在没有上班，我需要上班以后查询，然后回复你，感谢你的理解',en:'Hello sir, I am not working at the moment. I need to check and reply to you after I start working. Thank you for your understanding',fr:'Bonjour Monsieur, je ne suis pas au travail en ce moment, je dois me renseigner après le travail, puis vous répondre, merci de votre compréhension',ar:'مرحبا ، سيدي ، أنا لا أذهب إلى العمل الآن ، وأنا بحاجة إلى الذهاب إلى العمل بعد التحقيق ، ثم الرد عليك ، شكرا لكم على تفهمكم'},
  {code:'229',name:'187感谢你的信任先生',en:'Thank you for your trust, sir.',fr:'Merci pour votre confiance, monsieur.',ar:'شكرًا لثقتك سيدي.'},
  {code:'232',name:'188先生，我们有很多阿尔及利亚的客户，都是通过LC信用证来付款的。我们可以接受信用证',en:'Sir, we have many clients in Algeria who pay via L/C. We can accept L/C payments.',fr:'Monsieur, nous avons de nombreux clients en Algérie qui paient par L/C. Nous pouvons accepter les paiements par L/C.',ar:'سيدي، لدينا العديد من العملاء في الجزائر الذين يدفعون عن طريق خطاب اعتماد. يمكننا قبول الدفع عبر خطاب اعتماد.'},
  {code:'235',name:'189先生，这是我们能提供最好的价格。',en:'Sir, this is the best price we can offer.',fr:'Monsieur, c\'est le meilleur prix que nous pouvons offrir.',ar:'سيدي، هذا هو أفضل سعر يمكننا تقديمه.'},
  {code:'238',name:'190先生，我们提供的价格包含了海运费。',en:'Sir, the price we provide includes sea freight.',fr:'Monsieur, le prix que nous proposons inclut le fret maritime.',ar:'سيدي، السعر الذي نقدمه يشمل الشحن البحري.'},
  {code:'241',name:'191可以的先生，我们可以给你提供FOB的价格。',en:'Yes sir, we can provide you with FOB price.',fr:'Oui monsieur, nous pouvons vous fournir le prix FOB.',ar:'نعم سيدي، يمكننا تزويدك بسعر FOB.'},
  {code:'244',name:'192抱歉先生，这个价格我们无法出售。',en:'Sorry sir, we cannot sell at this price.',fr:'Désolé monsieur, nous ne pouvons pas vendre à ce prix.',ar:'عذرًا سيدي، لا يمكننا البيع بهذا السعر.'},
  {code:'247',name:'193先生，如果你确定购买的话，每台卡车我可以赠送你一些保养配件，方便你日后车辆的维修和保养。',en:'Sir, if you confirm the purchase, I can provide some maintenance parts for each truck to facilitate future maintenance and repairs.',fr:'Monsieur, si vous confirmez l\'achat, je peux fournir quelques pièces d\'entretien pour chaque camion afin de faciliter la maintenance et les réparations futures.',ar:'سيدي، إذا أكدت الشراء، يمكنني تزويدك ببعض قطع الصيانة لكل شاحنة لتسهيل صيانة وإصلاح الشاحنة لاحقًا.'},
  {code:'250',name:'194先生，我们赠送的配件有空气滤芯，机油，机滤，等一些常规保养的配件。',en:'Sir, the parts we provide include air filters, engine oil, oil filters, and other regular maintenance items.',fr:'Monsieur, les pièces que nous fournissons comprennent des filtres à air, de l\'huile moteur, des filtres à huile et d\'autres articles d\'entretien courant.',ar:'سيدي، القطع التي نقدمها تشمل فلاتر الهواء، وزيت المحرك، وفلاتر الزيت، وغيرها من قطع الصيانة العادية.'},
  {code:'253',name:'195可以的先生，关于更多的配件我也可以给你申请，尽量满足你的需求。',en:'Yes sir, I can also apply for more parts for you to meet your needs as much as possible.',fr:'Oui monsieur, je peux également demander d\'autres pièces pour vous afin de répondre au mieux à vos besoins.',ar:'نعم سيدي، يمكنني أيضًا طلب المزيد من القطع لتلبية احتياجاتك قدر الإمكان.'},
  {code:'256',name:'196先生，你想要什么配件？我这边可以查询一下。',en:'Sir, what parts do you want? I can check for you.',fr:'Monsieur, quelles pièces souhaitez-vous ? Je peux vérifier pour vous.',ar:'سيدي، ما هي القطع التي ترغب بها؟ يمكنني التحقق لك.'},
  {code:'259',name:'197好的，先生，感谢你的信任，我会尽快为你提供形式发票',en:'Okay sir, thank you for your trust. I will provide the proforma invoice as soon as possible.',fr:'D\'accord monsieur, merci pour votre confiance. Je fournirai la facture pro forma dès que possible.',ar:'حسنًا سيدي، شكرًا لثقتك، سأزودك بالفاتورة الأولية في أسرع وقت ممكن.'},
  {code:'262',name:'198先生你确定购买的话，我可以为你提供形式发票，方便你申请信用证。',en:'Sir, if you confirm the purchase, I can provide a proforma invoice to facilitate your L/C application.',fr:'Monsieur, si vous confirmez l\'achat, je peux fournir une facture pro forma pour faciliter votre demande de lettre de crédit.',ar:'سيدي، إذا أكدت الشراء، يمكنني تزويدك بفاتورة أولية لتسهيل تقديم طلب خطاب الاعتماد.'},
  {code:'265',name:'199先生，请把你公司的商业登记证书发送给我，我制作形式发票的时候需要使用。',en:'Sir, please send me your company’s business registration certificate, which I need to prepare the proforma invoice.',fr:'Monsieur, veuillez m\'envoyer le certificat d\'enregistrement commercial de votre société, dont j\'ai besoin pour préparer la facture pro forma.',ar:'سيدي، يرجى إرسال شهادة تسجيل الشركة الخاصة بك، أحتاجها لإعداد الفاتورة الأولية.'},
  {code:'268',name:'200是的，先生我可以为你提供发票，请你给我提供一下你的商业登记证书，方便我为你提供pi。',en:'Yes sir, I can provide the invoice. Please provide your business registration certificate to help me prepare the PI.',fr:'Oui monsieur, je peux fournir la facture. Veuillez me fournir votre certificat d\'enregistrement commercial pour que je puisse préparer le PI.',ar:'نعم سيدي، يمكنني تزويدك بالفاتورة، يرجى تزويدي بشهادة تسجيل الشركة لتسهيل إعداد الفاتورة الأولية.'},
  {code:'271',name:'201先生，根据申请PPI最新政策要求，PI中需同时包含客户的法语与阿语名称，另外除NIF号之外还需要客户都RC（营业执照）号',en:'Sir, according to the latest PPI policy requirements, the PI must include the customer’s name in French and Arabic, and in addition to the NIF, the customer’s RC (business license) number is also required.',fr:'Monsieur, selon les dernières exigences de la politique PPI, la PI doit inclure le nom du client en français et en arabe, et en plus du NIF, le numéro RC (licence commerciale) du client est également requis.',ar:'سيدي، وفقًا لأحدث متطلبات سياسة PPI، يجب أن تتضمن الفاتورة الأولية اسم العميل بالفرنسية والعربية، وبالإضافة إلى رقم NIF، مطلوب أيضًا رقم RC (رخصة العمل) للعميل.'},
  {code:'274',name:'202是的先生，如果你可以帮助我们成交的话，我们可以支付你佣金，需要看具体的车型，最高我们可以支付1500 美元的佣金。',en:'Yes sir, if you help us close the deal, we can pay you a commission. It depends on the specific truck model, and the maximum we can pay is $2,000.',fr:'Oui monsieur, si vous nous aidez à conclure la vente, nous pouvons vous verser une commission. Cela dépend du modèle spécifique de camion et le maximum que nous pouvons payer est de 1,500 $.',ar:'نعم سيدي، إذا ساعدتنا في إتمام الصفقة، يمكننا دفع عمولة لك. يعتمد ذلك على نوع الشاحنة المحدد، والحد الأقصى الذي يمكننا دفعه هو 1000 دولار.'},
  {code:'277',name:'203抱歉先生，如果你想要更多的佣金，你可以在我们的报价基础上增加费用，当交易结束的时候，我们转到你指定的账户。',en:'Sorry sir, if you want more commission, you can increase the fee based on our quotation. When the deal is completed, we will transfer it to your designated account.',fr:'Désolé monsieur, si vous voulez plus de commission, vous pouvez augmenter le montant sur la base de notre devis. Une fois la transaction terminée, nous le transférerons sur votre compte désigné.',ar:'عذرًا سيدي، إذا كنت تريد المزيد من العمولة، يمكنك زيادة الرسوم على أساس عرضنا. عند الانتهاء من الصفقة، سنحولها إلى حسابك المحدد.'},
  {code:'280',name:'204先生，当我们收到卡车的费用以后，我们可以把佣金转到你指定的账户。',en:'Sir, after we receive the payment for the trucks, we can transfer the commission to your designated account.',fr:'Monsieur, après réception du paiement des camions, nous pouvons transférer la commission sur votre compte désigné.',ar:'سيدي، بعد استلامنا لمبلغ الشاحنات، يمكننا تحويل العمولة إلى الحساب الذي تحدده.'},
  {code:'283',name:'205朋友，希望我们合作愉快。',en:'Friend, I hope we have a pleasant cooperation.',fr:'Ami, j\'espère que nous aurons une coopération agréable.',ar:'صديقي، آمل أن تكون لدينا شراكة ناجحة.'},
  {code:'286',name:'206先生，你购买卡车拿到了政府的审批了吗？',en:'Sir, have you obtained government approval for the truck purchase?',fr:'Monsieur, avez-vous obtenu l\'approbation du gouvernement pour l\'achat du camion ?',ar:'سيدي، هل حصلت على موافقة الحكومة لشراء الشاحنة؟'},
  {code:'289',name:'207先生，你的信用证申请好了吗？',en:'Sir, have you completed your L/C application?',fr:'Monsieur, avez-vous terminé votre demande de lettre de crédit ?',ar:'سيدي، هل أكملت طلب خطاب الاعتماد الخاص بك؟'},
  {code:'292',name:'208先生，你申请信用证的水单，请发我一下。方便我们公司财务查询这个信用证。',en:'Sir, please send me the payment slip for your L/C application. This will help our finance department check the L/C.',fr:'Monsieur, veuillez m\'envoyer le bordereau de paiement pour votre demande de L/C. Cela aidera notre service financier à vérifier la lettre de crédit.',ar:'سيدي، يرجى إرسال إيصال الدفع لطلب خطاب الاعتماد الخاص بك، سيساعد قسم المالية لدينا على التحقق من خطاب الاعتماد.'},
  {code:'295',name:'209可以的先生，我们收到水单以后，可以提前安排卡车的生产，这样你可以更快的见到你的卡车。',en:'Yes sir, after receiving the payment slip, we can arrange truck production in advance so that you can see your truck faster.',fr:'Oui monsieur, après réception du bordereau de paiement, nous pouvons organiser la production des camions à l\'avance afin que vous puissiez voir votre camion plus rapidement.',ar:'نعم سيدي، بعد استلام إيصال الدفع، يمكننا ترتيب إنتاج الشاحنة مسبقًا حتى تتمكن من رؤية شاحنتك بسرعة أكبر.'},
  {code:'298',name:'210先生，这是你的形式发票，请查收。',en:'Sir, this is your proforma invoice. Please check it.',fr:'Monsieur, voici votre facture pro forma. Veuillez la vérifier.',ar:'سيدي، هذه هي الفاتورة الأولية الخاصة بك، يرجى التحقق منها.'},
  {code:'301',name:'211先生，请查看。',en:'Sir, please check.',fr:'Monsieur, veuillez vérifier.',ar:'سيدي، يرجى التحقق.'},
  {code:'304',name:'212你好先生，我是中国人，我现在在中国，卡车也是在中国生产。',en:'Hello sir, I am Chinese, currently in China, and the trucks are also produced in China.',fr:'Bonjour monsieur, je suis chinois, je suis actuellement en Chine et les camions sont également produits en Chine.',ar:'مرحبًا سيدي، أنا صيني وأعيش حاليًا في الصين، والشاحنات تُنتج أيضًا في الصين.'},
  {code:'307',name:'213先生，我们有很多阿尔及利亚的客户，都是通过LC信用证来付款的，很抱歉我们无法直接收取第纳尔的货币.',en:'Sir, we have many clients in Algeria who pay via L/C. Sorry, we cannot accept payment in Dinar directly.',fr:'Monsieur, nous avons de nombreux clients en Algérie qui paient par L/C. Désolé, nous ne pouvons pas accepter le paiement en dinar directement.',ar:'سيدي، لدينا العديد من العملاء في الجزائر الذين يدفعون عن طريق خطاب اعتماد، نأسف لا يمكننا قبول الدفع بالدينار مباشرة.'},
  {code:'310',name:'214先生，阿尔及利亚购买卡车需要通过政府的审批，通过审批以后才可以到银行申请信用证，我们在收到信用证以后，会安排卡车的生产和运输',en:'Sir, purchasing trucks in Algeria requires government approval. Only after approval can you apply for an L/C at the bank. Once we receive the L/C, we will arrange truck production and shipment.',fr:'Monsieur, l\'achat de camions en Algérie nécessite une approbation gouvernementale. Ce n\'est qu\'après approbation que vous pouvez demander une lettre de crédit à la banque. Une fois que nous recevons la L/C, nous organiserons la production et l\'expédition des camions.',ar:'سيدي، شراء الشاحنات في الجزائر يتطلب موافقة حكومية، وبعد الموافقة يمكن تقديم طلب خطاب اعتماد في البنك، وبمجرد استلام خطاب الاعتماد سنقوم بترتيب إنتاج الشاحنات وشحنها.'},
  {code:'313',name:'215好的先生，有什么问题可以随时联系我，让我们保持联系。',en:'Okay sir, if you have any questions, feel free to contact me. Let’s keep in touch.',fr:'D\'accord monsieur, si vous avez des questions, n\'hésitez pas à me contacter. Restons en contact.',ar:'حسنًا سيدي، إذا كان لديك أي أسئلة، لا تتردد في الاتصال بي. لنحافظ على التواصل.'},
  {code:'316',name:'216好的先生，我明白你很着急购买卡车，我看一下，这个卡车有没有现车，如果有的话，我们在收到信用证以后马上安排给你发货。',en:'Okay sir, I understand you are eager to purchase the truck. Let me check if this truck is in stock. If yes, we will arrange shipment immediately after receiving the L/C.',fr:'D\'accord monsieur, je comprends que vous êtes pressé d\'acheter le camion. Je vais vérifier si ce camion est en stock. Si oui, nous organiserons l\'expédition immédiatement après réception de la L/C.',ar:'حسنًا سيدي، أفهم أنك متحمس لشراء الشاحنة. سأتحقق مما إذا كانت الشاحنة متوفرة. إذا كانت كذلك، سنقوم بترتيب الشحن فور استلام خطاب الاعتماد.'},
  {code:'319',name:'217抱歉先生，这个卡车没有现车，只能安排生产，生产周期大概30天',en:'Sorry sir, this truck is currently out of stock and can only be arranged for production. The production cycle is approximately 30 days',fr:'Désolé, Monsieur, ce camion n\'a pas de voiture actuelle, il peut seulement organiser la production, le cycle de production est d\'environ 30 jours',ar:'آسف ، سيدي ، هذه الشاحنة لا يوجد لديه سيارة في الوقت الحاضر ، يمكن فقط ترتيب الإنتاج ، دورة الإنتاج حوالي 30 يوما .'},
  {code:'322',name:'218稍等先生，我现在查询一下。',en:'Please wait sir, I will check now.',fr:'Veuillez patienter monsieur, je vais vérifier maintenant.',ar:'يرجى الانتظار سيدي، سأتحقق الآن.'},
  {code:'325',name:'219稍等先生，我给你发一张照片。',en:'Please wait sir, I will send you a photo.',fr:'Veuillez patienter monsieur, je vais vous envoyer une photo.',ar:'يرجى الانتظار سيدي، سأرسل لك صورة.'},
  {code:'328',name:'220稍等先生，我给你发一下卡车的配置。',en:'Please wait sir, I will send you the truck configuration.',fr:'Veuillez patienter monsieur, je vais vous envoyer la configuration du camion.',ar:'يرجى الانتظار سيدي، سأرسل لك تكوين الشاحنة.'},
  {code:'331',name:'221可以的先生，卡车的颜色是可以定制的。',en:'Yes sir, the truck color can be customized.',fr:'Oui monsieur, la couleur du camion peut être personnalisée.',ar:'نعم سيدي، يمكن تخصيص لون الشاحنة.'},
  {code:'334',name:'222先生，这是我们的卡车颜色的色卡，方便你做颜色的选择。',en:'Sir, this is our truck color chart, which will help you choose the color.',fr:'Monsieur, voici notre nuancier de couleurs pour camions, ce qui vous aidera à choisir la couleur.',ar:'سيدي، هذه هي لوحة ألوان شاحناتنا، لتسهيل اختيارك للون.'},
  {code:'337',name:'223先生，卡车是可以定制特殊的颜色，需要增加500美元的定制颜色的费用。',en:'Sir, the truck can be customized with special colors. An additional $500 is required for custom color.',fr:'Monsieur, le camion peut être personnalisé avec des couleurs spéciales. Des frais supplémentaires de 500 $ sont requis pour la couleur personnalisée.',ar:'سيدي، يمكن تخصيص الشاحنة بألوان خاصة، وتحتاج رسوم إضافية قدرها 500 دولار للون المخصص.'},
  {code:'340',name:'224是的先生，我们有产品目录，和网站。',en:'Yes sir, we have a product catalog and a website.',fr:'Oui monsieur, nous avons un catalogue de produits et un site web.',ar:'نعم سيدي، لدينا كتالوج منتجات وموقع إلكتروني.'},
  {code:'343',name:'225先生这是我们的网站，方便你查看https://www.sinocv.com/',en:'Sir, this is our website for your reference: https://www.sinocv.com/',fr:'Monsieur, voici notre site web pour référence : https://www.sinocv.com/',ar:'سيدي، هذا هو موقعنا للاطلاع: https://www.sinocv.com/'},
  {code:'346',name:'226先生我们whatsapp聊天记录的有我们的产品目录，你可以查看你想要的车型，有什么不明白可以随时联系我。',en:'Sir, our WhatsApp chat contains our product catalog. You can check the model you want, and contact me anytime if anything is unclear.',fr:'Monsieur, notre discussion WhatsApp contient notre catalogue de produits. Vous pouvez vérifier le modèle que vous souhaitez et me contacter à tout moment si quelque chose n\'est pas clair.',ar:'سيدي، تحتوي محادثة WhatsApp الخاصة بنا على كتالوج المنتجات، يمكنك التحقق من الطراز الذي تريده، وإذا كان هناك أي شيء غير واضح يمكنك الاتصال بي في أي وقت.'},
  {code:'349',name:'227抱歉先生，我们是专业出售卡车的，我们没有工程机械设备，如果你相信我的话，我也可以帮助你购买工程机械。',en:'Sorry sir, we specialize in selling trucks. We don’t have construction machinery. If you trust me, I can also help you purchase construction machinery.',fr:'Désolé monsieur, nous sommes spécialisés dans la vente de camions. Nous n\'avons pas de machines de construction. Si vous me faites confiance, je peux aussi vous aider à acheter des machines de construction.',ar:'عذرًا سيدي، نحن متخصصون في بيع الشاحنات، ولا نملك معدات البناء. إذا وثقت بي، يمكنني أيضًا مساعدتك في شراء معدات البناء.'},
  {code:'352',name:'228先生，你是想购买6x6的牵引车吗？',en:'Sir, do you want to purchase a 6x6 tractor truck?',fr:'Monsieur, voulez-vous acheter un camion tracteur 6x6 ?',ar:'سيدي، هل ترغب في شراء شاحنة جر 6x6؟'},
  {code:'355',name:'229是的先生，我们有6x6的牵引车。',en:'Yes sir, we have 6x6 tractor trucks.',fr:'Oui monsieur, nous avons des camions tracteurs 6x6.',ar:'نعم سيدي، لدينا شاحنات جر 6x6.'},
  {code:'358',name:'230先生，你是想购买6x6的自卸车吗？',en:'Sir, do you want to purchase a 6x6 dump truck?',fr:'Monsieur, voulez-vous acheter un camion benne 6x6 ?',ar:'سيدي، هل ترغب في شراء شاحنة قلابة 6x6؟'},
  {code:'361',name:'231是的先生，我们有6x6的自卸车。',en:'Yes sir, we have 6x6 dump trucks.',fr:'Oui monsieur, nous avons des camions bennes 6x6.',ar:'نعم سيدي، لدينا شاحنات قلابة 6x6.'},
  {code:'364',name:'232先生，你是想给牵引车加装一个油箱吗？',en:'Sir, do you want to add a fuel tank to the tractor truck?',fr:'Monsieur, voulez-vous ajouter un réservoir de carburant au camion tracteur ?',ar:'سيدي، هل ترغب في إضافة خزان وقود لشاحنة الجر؟'},
  {code:'367',name:'233先生，牵引车底盘无法加装油箱，只能在背部增加一个1000升的油箱。',en:'Sir, the tractor chassis cannot be equipped with a fuel tank. Only a 1000L tank can be added at the rear.',fr:'Monsieur, le châssis du tracteur ne peut pas être équipé d\'un réservoir de carburant. Seul un réservoir de 1000 litres peut être ajouté à l\'arrière.',ar:'سيدي، لا يمكن تركيب خزان وقود على هيكل شاحنة الجر، يمكن إضافة خزان بسعة 1000 لتر في الخلف فقط.'},
  {code:'370',name:'234先生，牵引车背部加装一个1000升的油箱，需要1200美元。',en:'Sir, adding a 1000L tank to the rear of the tractor truck costs $1,200.',fr:'Monsieur, ajouter un réservoir de 1000 litres à l\'arrière du camion tracteur coûte 1200 $.',ar:'سيدي، إضافة خزان بسعة 1000 لتر في خلف شاحنة الجر تكلف 1200 دولار.'},
  {code:'373',name:'235先生，你是想给这个卡车加装一个油箱吗？',en:'Sir, do you want to add a fuel tank to this truck?',fr:'Monsieur, voulez-vous ajouter un réservoir de carburant à ce camion ?',ar:'سيدي، هل ترغب في إضافة خزان وقود لهذه الشاحنة؟'},
  {code:'376',name:'236先生，你想要加装一个多大的油箱？',en:'Sir, what size of fuel tank do you want to add?',fr:'Monsieur, quelle taille de réservoir de carburant souhaitez-vous ajouter ?',ar:'سيدي، ما حجم خزان الوقود الذي ترغب في إضافته؟'},
  {code:'379',name:'237先生，加装一个400升的油箱需要600美元',en:'Sir, adding a 400L fuel tank costs $600.',fr:'Monsieur, ajouter un réservoir de 400 litres coûte 600 $.',ar:'سيدي، إضافة خزان وقود بسعة 400 لتر يكلف 600 دولار.'},
  {code:'382',name:'238先生，加装一个600升的油箱需要700美元',en:'Sir, adding a 600L fuel tank costs $700.',fr:'Monsieur, ajouter un réservoir de 600 litres coûte 700 $.',ar:'سيدي، إضافة خزان وقود بسعة 600 لتر يكلف 700 دولار.'},
  {code:'385',name:'239先生，你想给卡车加装一套监控系统吗？',en:'Sir, do you want to add a monitoring system to the truck?',fr:'Monsieur, voulez-vous ajouter un système de surveillance au camion ?',ar:'سيدي، هل ترغب في إضافة نظام مراقبة للشاحنة؟'},
  {code:'388',name:'240先生，给卡车加装一套原厂的监控和一个10英尺的屏幕，需要增加700美元。',en:'Sir, adding an OEM monitoring system and a 10-foot screen to the truck costs $700.',fr:'Monsieur, ajouter un système de surveillance d\'origine et un écran de 10 pieds au camion coûte 700 $.',ar:'سيدي، إضافة نظام مراقبة أصلي وشاشة 10 أقدام للشاحنة تكلف 700 دولار.'},
  {code:'391',name:'241先生，给卡车加装一套副厂的监控和一个10英尺的屏幕，需要增加430美元。',en:'Sir, adding an aftermarket monitoring system and a 10-foot screen costs $430.',fr:'Monsieur, ajouter un système de surveillance de rechange et un écran de 10 pieds coûte 430 $.',ar:'سيدي، إضافة نظام مراقبة غير أصلي وشاشة 10 أقدام تكلف 430 دولار.'},
  {code:'394',name:'242先生，你是想要加装一个原厂的驻车空调吗？',en:'Sir, do you want to add an OEM parking air conditioner?',fr:'Monsieur, voulez-vous ajouter un climatiseur de stationnement d\'origine ?',ar:'سيدي، هل ترغب في إضافة مكيف هواء موقف أصلي؟'},
  {code:'397',name:'243可以的先生，加装一个原厂的驻车空调，需要1200美元',en:'Yes sir, adding an OEM parking air conditioner costs $1,200.',fr:'Oui monsieur, ajouter un climatiseur de stationnement d\'origine coûte 1 200 $.',ar:'نعم سيدي، إضافة مكيف هواء موقف أصلي تكلف 1200 دولار.'},
  {code:'400',name:'244先生，你是想要加装一个原厂的冰箱吗？',en:'Sir, do you want to add an OEM refrigerator?',fr:'Monsieur, voulez-vous ajouter un réfrigérateur d\'origine ?',ar:'سيدي، هل ترغب في إضافة ثلاجة أصلية للشاحنة؟'},
  {code:'403',name:'245可以的先生，可以给卡车加装一个冰箱，原厂的冰箱价格是500美元',en:'Yes sir, you can add a refrigerator to the truck. The OEM refrigerator costs $500.',fr:'Oui monsieur, vous pouvez ajouter un réfrigérateur au camion. Le réfrigérateur d\'origine coûte 500 $.',ar:'نعم سيدي، يمكنك إضافة ثلاجة للشاحنة، وسعر الثلاجة الأصلية 500 دولار.'},
  {code:'406',name:'246先生你是想要给卡车加装一套液压系统吗？',en:'Sir, do you want to add a hydraulic system to the truck?',fr:'Monsieur, voulez-vous ajouter un système hydraulique au camion ?',ar:'سيدي، هل ترغب في إضافة نظام هيدروليكي للشاحنة؟'},
  {code:'409',name:'247可以的先生，可以加装一套液压系统，加装一套液压系统的价格是2000美元。',en:'Yes sir, a hydraulic system can be added. The price for adding a hydraulic system is $2,000.',fr:'Oui monsieur, un système hydraulique peut être ajouté. Le prix pour ajouter un système hydraulique est de 2000 $.',ar:'نعم سيدي، يمكن إضافة نظام هيدروليكي، وسعر إضافة النظام الهيدروليكي هو 2000 دولار.'},
  {code:'412',name:'248先生，液压系统的油箱一般是180升的油箱，180升的液压油箱就可以满足使用。',en:'Sir, the hydraulic system’s tank is usually 180 liters, which is sufficient for use.',fr:'Monsieur, le réservoir du système hydraulique est généralement de 180 litres, ce qui suffit pour l\'utilisation.',ar:'سيدي، خزان النظام الهيدروليكي عادةً بسعة 180 لتر، وهذه السعة تكفي للاستخدام.'},
  {code:'415',name:'249先生，你是想要加装一个牵引绞盘吗？',en:'Sir, do you want to add a winch?',fr:'Monsieur, voulez-vous ajouter un treuil ?',ar:'سيدي، هل ترغب في إضافة ونش سحب؟'},
  {code:'418',name:'250可以的先生，加装一个5吨牵引绞盘，价格是560美元',en:'Yes sir, a 5-ton winch can be added. The price is $560.',fr:'Oui monsieur, un treuil de 5 tonnes peut être ajouté. Le prix est de 560 $.',ar:'نعم سيدي، يمكن إضافة ونش بسعة 5 طن، السعر 560 دولار.'},
  {code:'421',name:'251可以用的先生，加装一个10吨的牵引绞盘，价格是800美元',en:'Yes sir, a 10-ton winch can be added. The price is $800.',fr:'Oui monsieur, un treuil de 10 tonnes peut être ajouté. Le prix est de 800 $.',ar:'نعم سيدي، يمكن إضافة ونش بسعة 10 طن، السعر 800 دولار.'},
  {code:'424',name:'252先生，这个固特异固特异315/80r22.5，单胎价格是400美元',en:'Sir, this Goodyear 315/80R22.5 tire costs $400 per tire.',fr:'Monsieur, ce pneu Goodyear 315/80R22.5 coûte 400 $ l\'unité.',ar:'سيدي، هذا الإطار Goodyear 315/80R22.5 سعر الإطار الواحد 400 دولار.'},
  {code:'427',name:'253先生，这个固特异385/80r22.5的轮胎加轮毂价格是600美元',en:'Sir, this Goodyear 385/80R22.5 tire with rim costs $600.',fr:'Monsieur, ce pneu Goodyear 385/80R22.5 avec jante coûte 600 $.',ar:'سيدي، هذا الإطار Goodyear 385/80R22.5 مع الجنط يكلف 600 دولار.'},
  {code:'430',name:'254先生，你是想给燃油再加装一台过滤系统吗？',en:'Sir, do you want to add a fuel filtration system to the truck?',fr:'Monsieur, voulez-vous ajouter un système de filtration de carburant au camion ?',ar:'سيدي، هل ترغب في إضافة نظام تصفية وقود للشاحنة؟'},
  {code:'433',name:'255先生给卡车加装粗滤，需要增加290美元',en:'Sir, adding a coarse filter to the truck costs $290.',fr:'Monsieur, ajouter un filtre grossier au camion coûte 290 $.',ar:'سيدي، إضافة فلتر خشن للشاحنة يكلف 290 دولار.'},
  {code:'436',name:'256先生，你是想要更换一组驻车空调的电池吗？',en:'Sir, do you want to replace the parking air conditioner battery?',fr:'Monsieur, voulez-vous remplacer la batterie du climatiseur de stationnement ?',ar:'سيدي، هل ترغب في استبدال بطارية مكيف الهواء الخاص بالوقوف؟'},
  {code:'439',name:'257先生，加装一组骆驼品牌5度的锂电池，可以让驻车空调使用12个小时左右，价格是980美元',en:'Sir, installing a set of Camel brand 5Ah lithium batteries allows the parking A/C to run for about 12 hours. The price is $980.',fr:'Monsieur, installer un ensemble de batteries lithium de marque Camel 5 Ah permet au climatiseur de stationnement de fonctionner environ 12 heures. Le prix est de 980 $.',ar:'سيدي، تركيب مجموعة بطاريات ليثيوم ماركة Camel بسعة 5 أمبير تسمح لمكيف الهواء بالعمل حوالي 12 ساعة، السعر 980 دولار.'},
  {code:'442',name:'258先生，三角轮胎315/80r22.5轮胎不锈钢轮毂每条价格是500美元',en:'Sir, the Triangle 315/80R22.5 tire with stainless steel rim costs $500 each.',fr:'Monsieur, le pneu Triangle 315/80R22.5 avec jante en acier inoxydable coûte 500 $ chacun.',ar:'سيدي، إطار Triangle 315/80R22.5 مع جنط من الفولاذ المقاوم للصدأ يكلف 500 دولار لكل إطار.'},
  {code:'445',name:'259你好先生，你之前咨询的卡车还想要购买吗？',en:'Hello sir, do you still want to purchase the trucks you previously inquired about?',fr:'Bonjour monsieur, souhaitez-vous toujours acheter les camions dont vous avez précédemment fait la demande ?',ar:'مرحبًا سيدي، هل لا تزال ترغب في شراء الشاحنات التي استفسرت عنها سابقًا؟'},
  {code:'448',name:'260你好先生，你的信用证申请下来了吗？',en:'Hello sir, has your L/C application been approved?',fr:'Bonjour monsieur, votre demande de L/C a-t-elle été approuvée ?',ar:'مرحبًا سيدي، هل تمت الموافقة على طلب خطاب الاعتماد الخاص بك؟'},
  {code:'451',name:'261你好我的朋友，你的信用证申请下来吗？',en:'Hello my friend, has your L/C application been approved?',fr:'Bonjour mon ami, votre demande de L/C a-t-elle été approuvée ?',ar:'مرحبًا صديقي، هل تمت الموافقة على طلب خطاب الاعتماد الخاص بك؟'},
  {code:'454',name:'262你好先生，你购买卡车的申请被政府批准了吗？',en:'Hello sir, has your truck purchase application been approved by the government?',fr:'Bonjour monsieur, votre demande d\'achat de camion a-t-elle été approuvée par le gouvernement ?',ar:'مرحبًا سيدي، هل تمت الموافقة على طلب شراء الشاحنة من قبل الحكومة؟'},
  {code:'457',name:'263你好先生，你购买的卡车已经发运了，我会定时给你更新船行驶的轨迹信息。',en:'Hello sir, the trucks you purchased have been shipped. I will update you regularly with the ship’s tracking information.',fr:'Bonjour monsieur, les camions que vous avez achetés ont été expédiés. Je vous fournirai régulièrement les informations de suivi du navire.',ar:'مرحبًا سيدي، تم شحن الشاحنات التي اشتريتها، سأرسل لك تحديثات منتظمة لمسار السفينة.'},
  {code:'460',name:'264稍等先生，我给你发车辆的配置和照片。',en:'Please wait sir, I will send you the truck configuration and photos.',fr:'Veuillez patienter monsieur, je vais vous envoyer la configuration et les photos du camion.',ar:'يرجى الانتظار سيدي، سأرسل لك تكوين الشاحنة والصور.'},
  {code:'463',name:'265抱歉先生，我现在在休息，我上班以后，会查询一下并发送给你。',en:'Sorry sir, I am currently resting. I will check and send you the information after work.',fr:'Désolé monsieur, je me repose actuellement. Je vérifierai et vous enverrai les informations après le travail.',ar:'عذرًا سيدي، أنا أستريح حاليًا، سأتحقق وأرسل لك المعلومات بعد العودة للعمل.'},
  {code:'466',name:'2101先生，这款 SITRAK 4×2 牵引车，单卧铺，430 马力，手动挡，CFR 价格 60700 美元。',en:'Sir, this SITRAK 4×2 tractor truck, single sleeper, 430 HP, manual transmission, CFR price is $60,700.',fr:'Monsieur, ce tracteur SITRAK 4×2, couchette simple, 430 ch, transmission manuelle, prix CFR 60,700 $.',ar:'سيدي، هذه شاحنة جر SITRAK 4×2، سرير مفرد، 430 حصان، ناقل حركة يدوي، السعر CFR 60,700 دولار.'},
  {code:'469',name:'2102先生，这款 SITRAK 4×2 牵引车，单卧铺，430 马力，自动挡，CFR 价格 64000 美元。',en:'Sir, this SITRAK 4×2 tractor truck, single sleeper, 430 HP, automatic transmission, CFR price is $64,000.',fr:'Monsieur, ce tracteur SITRAK 4×2, couchette simple, 430 ch, transmission automatique, prix CFR 64,000 $.',ar:'سيدي، هذه شاحنة جر SITRAK 4×2، سرير مفرد، 430 حصان، ناقل حركة أوتوماتيكي، السعر CFR 64,000 دولار.'},
  {code:'472',name:'2103先生，这款 SITRAK 4×2 牵引车 G7S，双卧铺，480 马力，自动挡，空气悬挂，CFR 价格 72000 美元。',en:'Sir, this SITRAK 4×2 tractor truck G7S, double sleeper, 480 HP, automatic transmission, air suspension, CFR price is $72,000.',fr:'Monsieur, ce tracteur SITRAK 4×2 G7S, couchette double, 480 ch, transmission automatique, suspension pneumatique, prix CFR 72,000 $.',ar:'سيدي، هذه شاحنة جر SITRAK 4×2 G7S، سرير مزدوج، 480 حصان، ناقل حركة أوتوماتيكي، تعليق هوائي، السعر CFR 72,000 دولار.'},
  {code:'475',name:'2104先生，这款 SITRAK 6×4 牵引车，单卧铺，430 马力，手动挡，CFR 价格 65000 美元。',en:'Sir, this SITRAK 6×4 tractor truck, single sleeper, 430 HP, manual transmission, CFR price is $65,000.',fr:'Monsieur, ce tracteur SITRAK 6×4, couchette simple, 430 ch, transmission manuelle, prix CFR 65,000 $.',ar:'سيدي، هذه شاحنة جر SITRAK 6×4، سرير مفرد، 430 حصان، ناقل حركة يدوي، السعر CFR 65,000 دولار.'},
  {code:'478',name:'2105先生，这款 SITRAK 6×4 牵引车，单卧铺，430 马力，手动挡，载重版，CFR 价格 66300 美元。',en:'Sir, this SITRAK 6×4 tractor truck, single sleeper, 430 HP, manual transmission, heavy-duty version, CFR price is $66,300.',fr:'Monsieur, ce tracteur SITRAK 6×4, couchette simple, 430 ch, transmission manuelle, version lourde, prix CFR 66,300 $.',ar:'سيدي، هذه شاحنة جر SITRAK 6×4، سرير مفرد، 430 حصان، ناقل حركة يدوي، نسخة ثقيلة، السعر CFR 66,300 دولار.'},
  {code:'481',name:'2106先生，这款 SITRAK 6×4 牵引车，单卧铺，手动挡，480 马力，CFR 价格 66200 美元。',en:'Sir, this SITRAK 6×4 tractor truck, single sleeper, manual transmission, 480 HP, CFR price is $66,200.',fr:'Monsieur, ce tracteur SITRAK 6×4, couchette simple, transmission manuelle, 480 ch, prix CFR 66,200 $.',ar:'سيدي، هذه شاحنة جر SITRAK 6×4، سرير مفرد، ناقل حركة يدوي، 480 حصان، السعر CFR 66,200 دولار.'},
  {code:'484',name:'2107先生，这款 SITRAK 6×4 牵引车，单卧铺，自动挡，480 马力，CFR 价格 73000 美元。',en:'Sir, this SITRAK 6×4 tractor truck, single sleeper, automatic transmission, 480 HP, CFR price is $73,000.',fr:'Monsieur, ce tracteur SITRAK 6×4, couchette simple, transmission automatique, 480 ch, prix CFR 73,000 $.',ar:'سيدي، هذه شاحنة جر SITRAK 6×4، سرير مفرد، ناقل حركة أوتوماتيكي، 480 حصان، السعر CFR 73,000 دولار.'},
  {code:'487',name:'2108先生，这款 SITRAK 6×4 牵引车，单卧铺，手动挡，480 马力，载重版，CFR 价格 67300 美元。',en:'Sir, this SITRAK 6×4 tractor truck, single sleeper, manual transmission, 480 HP, heavy-duty version, CFR price is $67,300.',fr:'Monsieur, ce tracteur SITRAK 6×4, couchette simple, transmission manuelle, 480 ch, version lourde, prix CFR 67,300 $.',ar:'سيدي، هذه شاحنة جر SITRAK 6×4، سرير مفرد، ناقل حركة يدوي، 480 حصان، نسخة ثقيلة، السعر CFR 67,300 دولار.'},
  {code:'490',name:'2109先生，这款 SITRAK 6×4 牵引车 G7G，双卧铺，手动挡，480 马力，CFR 价格 67400 美元。',en:'Sir, this SITRAK 6×4 tractor truck G7G, double sleeper, manual transmission, 480 HP, CFR price is $67,400.',fr:'Monsieur, ce tracteur SITRAK 6×4 G7G, couchette double, transmission manuelle, 480 ch, prix CFR 67,400 $.',ar:'سيدي، هذه شاحنة جر SITRAK 6×4 G7G، سرير مزدوج، ناقل حركة يدوي، 480 حصان، السعر CFR 67,400 دولار.'},
  {code:'493',name:'2110先生，这款 SITRAK 6×4 牵引车 G7G，双卧铺，手动挡，480 马力，载重版 CL，CFR 价格 68500 美元。',en:'Sir, this SITRAK 6×4 tractor truck G7G, double sleeper, manual transmission, 480 HP, heavy-duty CL version, CFR price is $68,500.',fr:'Monsieur, ce tracteur SITRAK 6×4 G7G, couchette double, transmission manuelle, 480 ch, version lourde CL, prix CFR 68,500 $.',ar:'سيدي، هذه شاحنة جر SITRAK 6×4 G7G، سرير مزدوج، ناقل حركة يدوي، 480 حصان، نسخة ثقيلة CL، السعر CFR 68,500 دولار.'},
  {code:'496',name:'2111先生，这款 SITRAK 6×4 牵引车 G7S，单卧铺，自动挡，480 马力，载重版，CFR 价格 75000 美元。',en:'Sir, this SITRAK 6×4 tractor G7S, single sleeper, AMT, 480 HP, heavy-duty version, CFR price is 75,000 USD.',fr:'Monsieur, ce tracteur SITRAK 6×4 G7S, une couchette, boîte automatique, 480 ch, version renforcée, le prix CFR est de 74 000 USD.',ar:'سيدي، شاحنة SITRAK 6×4 طراز G7S، سرير واحد، جير أوتوماتيك، 480 حصان، نسخة الحمولة الثقيلة، سعر CFR هو 74,000 دولار أمريكي.'},
  {code:'499',name:'2112先生，这款 SITRAK 6×4 牵引车 G7S，双卧铺，480马力自动挡，载重版，CFR 价格 76900 美元。',en:'Sir, this SITRAK 6×4 tractor unit G7S, double sleeper cabin, 480 horsepower automatic transmission, heavy-duty version, CFR price 75900 US dollars.',fr:'Monsieur, ce tracteur routier SITRAK 6×4 modèle G7S, cabine à double couchette, 480 chevaux boîte de vitesses automatique, version renforcée pour charge lourde, prix CFR 75900 dollars américains.',ar:'سيدي، وحدة جرار ستراك 6×4 موديل G7S، كابينة بسرير مزدوج، بقوة 480 حصان وناقل حركة أوتوماتيكي، الإصدار المحمّل للحمولات الثقيلة، سعر CFR 75900 دولار أمريكي.'},
  {code:'502',name:'2113先生，这款 SITRAK 6×4 牵引车 G7S，双卧铺，540马力自动挡，标准版钢板悬架，CFR 价格 74000 美元。',en:'Sir, this SITRAK 6×4 tractor unit G7S, double sleeper cabin, 540 horsepower automatic transmission, standard leaf spring suspension, CFR price 74,000 US dollars.',fr:'Monsieur, ce tracteur routier SITRAK 6×4 modèle G7S, cabine à double couchette, 540 chevaux boîte automatique, suspension à lames standard, prix CFR 73 000 dollars américains.',ar:'سيدي، وحدة جرار ستراك 6×4 موديل G7S، كابينة سرير مزدوج، بقوة 540 حصان وناقل حركة أوتوماتيكي، تعليق صفيحي قياسي، سعر CFR 73000 دولار أمريكي.'},
  {code:'505',name:'2114先生，这款 SITRAK 6×4 牵引车 G7S，双卧铺，540马力自动挡，标准版空气悬挂，CFR 价格 76000 美元。',en:'Sir, this SITRAK 6×4 tractor unit G7S, double sleeper, 540 horsepower with automatic transmission, standard air suspension, CFR price 76,000 US dollars.',fr:'Monsieur, ce tracteur routier SITRAK 6×4 modèle G7S, double couchette, 540 chevaux avec boîte de vitesses automatique, suspension pneumatique standard, prix CFR 75 000 dollars américains.',ar:'سيدي، وحدة جرار ستراك 6×4 موديل G7S، بسرير مزدوج، بقوة 540 حصان وناقل حركة أوتوماتيكي، تعليق هوائي قياسي، وسعر CFR 75000 دولار أمريكي.'},
  {code:'508',name:'2115先生，这款豪沃 TX 6×4，430 马力， MAN 发动机， CFR 的价格是 52000 美元。',en:'Sir, this HOWO TX 6×4, 430 HP, MAN engine, the CFR price is 52,500 USD.',fr:'Monsieur, ce HOWO TX 6×4, 430 ch, moteur MAN, le prix CFR est de 52 000 USD.',ar:'سيدي، شاحنة HOWO TX 6×4، بقوة 430 حصان، محرك MAN، سعر CFR هو 52,000 دولار أمريكي.'},
  {code:'511',name:'2116先生，这款豪沃 TX 6×4，430 马力， weichai发动机， CFR 的价格是 49500美元。',en:'Sir, this HOWO TX 6×4, 430 HP, Weichai engine, the CFR price is 50,000 USD.',fr:'Monsieur, ce HOWO TX 6×4, 430 ch, moteur Weichai, le prix CFR est de 49 500 USD.',ar:'سيدي، شاحنة HOWO TX 6×4، بقوة 430 حصان، محرك Weichai، سعر CFR هو 49,500 دولار أمريكي.'},
  {code:'514',name:'2117先生，这款 T7H 4×2 430马力单卧铺平顶牵引车，13吨后桥，CFR 价格 43700 美元。',en:'Sir, this T7H 4×2 tractor unit with 430 horsepower, single sleeper flat roof cab, 13-ton rear axle, CFR price 43700 US dollars.',fr:'Monsieur, ce tracteur routier T7H 4×2 de 430 chevaux, cabine toit plat à simple couchette, pont arrière de 13 tonnes, prix CFR 43700 dollars américains.',ar:'سيدي، وحدة جرار T7H 4×2 بقوة 430 حصان، كابينة سقف مسطح بسرير واحد، محور خلفي 13 طن، سعر CFR 43700 دولار أمريكي.'},
  {code:'517',name:'2118先生，这款 T7H 4×2 430马力单卧铺平顶牵引车，16吨后桥，CFR 价格 46100 美元。',en:'Sir, this T7H 4×2 tractor unit, 430 horsepower, single sleeper flat roof cab, 16-ton rear axle, CFR price 46100 US dollars.',fr:'Monsieur, ce tracteur routier T7H 4×2 de 430 chevaux, cabine toit plat à simple couchette, pont arrière de 16 tonnes, prix CFR 46100 dollars américains.',ar:'سيدي، وحدة جرار T7H 4×2 بقوة 430 حصان، كابينة سقف مسطح بسرير واحد، محور خلفي 16 طن، سعر CFR 46100 دولار أمريكي.'},
  {code:'520',name:'2119先生，这款 T7H 6×4 430马力平顶牵引车，单卧铺，13吨后桥，CFR 价格 49100 美元。',en:'Sir, this T7H 6×4 tractor unit, 430 horsepower, flat roof cab with single sleeper, 13-ton rear axle, CFR price 49100 US dollars.',fr:'Monsieur, ce tracteur routier T7H 6×4 de 430 chevaux, cabine toit plat à simple couchette, pont arrière de 13 tonnes, prix CFR 49100 dollars américains.',ar:'سيدي، وحدة جرار T7H 6×4 بقوة 430 حصان، كابينة سقف مسطح بسرير واحد، محور خلفي 13 طن، سعر CFR 49100 دولار أمريكي.'},
  {code:'523',name:'2120先生，这款 T7H 6×4 430马力高顶牵引车，双卧铺，13吨后桥，CFR 价格 50100 美元。',en:'Sir, this T7H 6×4 high-roof tractor unit, 430 horsepower, double sleeper, 13-ton rear axle, CFR price 50100 US dollars.',fr:'Monsieur, ce tracteur routier T7H 6×4 à toit haut, 430 chevaux, double couchette, pont arrière de 13 tonnes, prix CFR 50100 dollars américains.',ar:'سيدي، وحدة جرار T7H 6×4 ذات السقف المرتفع، بقوة 430 حصان، بسرير مزدوج، محور خلفي 13 طن، سعر CFR 50100 دولار أمريكي.'},
  {code:'526',name:'2121先生，这款 T7H 6×4 430马力平顶牵引车，单卧铺，16吨后桥，CFR 价格 52100 美元。',en:'Sir, this T7H 6×4 tractor unit, 430 horsepower, flat roof with single sleeper, 16-ton rear axle, CFR price 52100 US dollars.',fr:'Monsieur, ce tracteur routier T7H 6×4 de 430 chevaux, cabine toit plat à simple couchette, pont arrière de 16 tonnes, prix CFR 52100 dollars américains.',ar:'سيدي، وحدة جرار T7H 6×4 بقوة 430 حصان، كابينة سقف مسطح بسرير واحد، محور خلفي 16 طن، سعر CFR 52100 دولار أمريكي.'},
  {code:'529',name:'2122先生，这款 T7H 6×4 430马力高顶牵引车，双卧铺，16吨后桥，CFR 价格 53300 美元。',en:'Sir, this T7H 6×4 high-roof tractor unit, 430 horsepower, double sleeper cabin, 16-ton rear axle, CFR price 53,300 US dollars.',fr:'Monsieur, ce tracteur routier T7H 6×4 à toit haut, 430 chevaux, cabine à double couchette, pont arrière de 16 tonnes, prix CFR 53 300 dollars américains.',ar:'سيدي، وحدة جرار T7H 6×4 ذات السقف المرتفع، بقوة 430 حصان، كابينة بسرير مزدوج، محور خلفي 16 طن، سعر CFR 53300 دولار أمريكي.'},
  {code:'532',name:'2201先生，这款豪沃 TX 6×4 自卸车，340 马力，货箱 16 立方，CFR 价格 50500 美元。',en:'Sir, this HOWO TX 6×4 dump truck, 340 HP, 16 cubic meters cargo box, CFR price is $50,500.',fr:'Monsieur, ce camion-benne HOWO TX 6×4, 340 ch, caisse de 16 mètres cubes, prix CFR 50,500 $.',ar:'سيدي، هذه شاحنة قلابة HOWO TX 6×4، 340 حصان، صندوق حمولته 16 متر³، السعر CFR 50,500 دولار.'},
  {code:'535',name:'2202先生，这款豪沃 TX 6×4 自卸车，380 马力，货箱 18 立方，CFR 价格 51900 美元。',en:'Sir, this HOWO TX 6×4 dump truck, 380 HP, 18 cubic meters cargo box, CFR price is $51,900.',fr:'Monsieur, ce camion-benne HOWO TX 6×4, 380 ch, caisse de 18 mètres cubes, prix CFR 51,900 $.',ar:'سيدي، هذه شاحنة قلابة HOWO TX 6×4، 380 حصان، صندوق حمولته 18 متر³، السعر CFR 51,900 دولار.'},
  {code:'538',name:'2203先生，这款豪沃 TX 8×4 自卸车，400 马力，货箱 22 立方，CFR 价格 60200 美元。',en:'Sir, this HOWO TX 8×4 dump truck, 400 HP, 22 cubic meters cargo box, CFR price is $60,200.',fr:'Monsieur, ce camion-benne HOWO TX 8×4, 400 ch, caisse de 22 mètres cubes, prix CFR 60,200 $.',ar:'سيدي، هذه شاحنة قلابة HOWO TX 8×4، 400 حصان، صندوق حمولته 22 متر³، السعر CFR 60,200 دولار.'},
  {code:'541',name:'2204先生，这款豪沃6×4自卸车，340马力，货箱16立方，CFR价格47000美元。',en:'Sir, this HOWO 6×4 dump truck, 340 HP, 16 cubic meters cargo box, CFR price is $47,000.',fr:'Monsieur, ce camion-benne HOWO 6×4, 340 ch, caisse de 16 mètres cubes, prix CFR 47,000 $.',ar:'سيدي، هذه شاحنة قلابة HOWO 6×4، 340 حصان، صندوق حمولته 16 متر³، السعر CFR 47,000 دولار.'},
  {code:'544',name:'2205先生，这款豪沃6×4自卸车，380马力，货箱18立方，CFR价格49400美元。',en:'Sir, this HOWO 6×4 dump truck, 380 HP, 18 cubic meters cargo box, CFR price is $49,400.',fr:'Monsieur, ce camion-benne HOWO 6×4, 380 ch, caisse de 18 mètres cubes, prix CFR 49,400 $.',ar:'سيدي، هذه شاحنة قلابة HOWO 6×4، 380 حصان، صندوق حمولته 18 متر³، السعر CFR 49,400 دولار.'},
  {code:'547',name:'2206先生，这款豪沃8×4自卸车，400马力发动机，货箱22立方，CFR价格57400美元。',en:'Sir, this HOWO 8×4 dump truck, 400 HP engine, 22 cubic meters cargo box, CFR price is $57,400.',fr:'Monsieur, ce camion-benne HOWO 8×4, moteur 400 ch, caisse de 22 mètres cubes, prix CFR 57,400 $.',ar:'سيدي، هذه شاحنة قلابة HOWO 8×4، محرك 400 حصان، صندوق حمولته 22 متر³، السعر CFR 57,400 دولار.'},
  {code:'550',name:'2207先生，这款豪沃 8×4 自卸车，430 马力，货箱 7.6米，货箱36立方， CFR 的价格是 62,200 美元。',en:'Sir, this HOWO 8×4 dump truck, 430 HP, 7.6 meters cargo box, 36 cubic meters, CFR price is $62,700.',fr:'Monsieur, ce camion-benne HOWO 8×4, 430 ch, caisse de 7,6 mètres, 36 mètres cubes, prix CFR 62,700 $.',ar:'سيدي، هذه شاحنة قلابة HOWO 8×4، 430 حصان، صندوق طوله 7.6 متر، سعته 36 متر³، السعر CFR 62,700 دولار.'},
  {code:'553',name:'2208先生，这款 SITRAK 6×4 自卸车，配备MAN发动机，430 马力，货箱 18.63 立方，CFR 价格 69700 美元。',en:'Sir, this SITRAK 6×4 dump truck with MAN engine, 430 HP, cargo box 18.63 cubic meters, CFR price is $69,700.',fr:'Monsieur, ce camion-benne SITRAK 6×4 avec moteur MAN, 430 ch, caisse de 18,63 mètres cubes, prix CFR 69,700 $.',ar:'سيدي، هذه شاحنة قلابة SITRAK 6×4، مزودة بمحرك MAN، 430 حصان، صندوق حمولته 18.63 متر³، السعر CFR 69,700 دولار.'},
  {code:'556',name:'2209先生，这款 SITRAK 8×4 自卸车，配备 MAN 发动机，430 马力，货箱 22 立方，CFR 价格 72500 美元。',en:'Sir, this SITRAK 8×4 dump truck with MAN engine, 430 HP, 22 cubic meters cargo box, CFR price is $72,500.',fr:'Monsieur, ce camion-benne SITRAK 8×4 avec moteur MAN, 430 ch, caisse de 22 mètres cubes, prix CFR 72,500 $.',ar:'سيدي، هذه شاحنة قلابة SITRAK 8×4، مزودة بمحرك MAN، 430 حصان، صندوق حمولته 22 متر³، السعر CFR 72,500 دولار.'},
  {code:'559',name:'2210先生，这款 SITRAK 8×4 自卸车，配备 MAN 发动机，480 马力，货箱 25 立方，CFR 价格 79500 美元。',en:'Sir, this SITRAK 8×4 dump truck with MAN engine, 480 HP, 25 cubic meters cargo box, CFR price is $79,500.',fr:'Monsieur, ce camion-benne SITRAK 8×4 avec moteur MAN, 480 ch, caisse de 25 mètres cubes, prix CFR 79,500 $.',ar:'سيدي، هذه شاحنة قلابة SITRAK 8×4، مزودة بمحرك MAN، 480 حصان، صندوق حمولته 25 متر³، السعر CFR 79,500 دولار.'},
  {code:'562',name:'2301先生，这款豪沃统帅 4×2 轻卡潍柴140马力发动机 3.5 吨底盘， CFR 的价格是 15300 美元。',en:'Sir, this HOWO Leader 4×2 light truck with Weichai 140 HP engine, 3.5-ton chassis, CFR price is $15,800.',fr:'Monsieur, ce camion léger HOWO Leader 4×2 avec moteur Weichai 140 ch, châssis de 3,5 tonnes, prix CFR 15,800 $.',ar:'سيدي، هذه شاحنة خفيفة HOWO Leader 4×2، بمحرك Weichai 140 حصان، شاسيه 3.5 طن، السعر CFR 15,800 دولار.'},
  {code:'565',name:'2302先生，这款豪沃统帅 4×2 轻卡玉柴120马力发动机 3.5 吨底盘， CFR 的价格是 14900 美元。',en:'Sir, this HOWO Leader 4×2 light truck with Yuchai 120 HP engine, 3.5-ton chassis, CFR price is $15,400.',fr:'Monsieur, ce camion léger HOWO Leader 4×2 avec moteur Yuchai 120 ch, châssis de 3,5 tonnes, prix CFR 15,400 $.',ar:'سيدي، هذه شاحنة خفيفة HOWO Leader 4×2، بمحرك Yuchai 120 حصان، شاسيه 3.5 طن، السعر CFR 15,400 دولار.'},
  {code:'568',name:'2303先生，这款豪沃统帅 3.5 吨轻卡，140马力，货箱 4.2 米， CFR 的价格是18100美元。',en:'Sir, this HOWO Leader 3.5-ton light truck, 140 HP, 4.2-meter cargo box, CFR price is $18,600.',fr:'Monsieur, ce camion léger HOWO Leader 3,5 tonnes, 140 ch, caisse de 4,2 mètres, prix CFR 18,600 $.',ar:'سيدي، هذه شاحنة خفيفة HOWO Leader 3.5 طن، 140 حصان، صندوق طوله 4.2 متر، السعر CFR 18,600 دولار.'},
  {code:'571',name:'2304先生，这款豪沃统帅 3.5 吨轻卡，货箱 4.2 米，玉柴 120 马力发动机。 CFR价格14900 美元。',en:'Sir, this HOWO Leader 3.5-ton light truck, 4.2-meter cargo box, Yuchai 120 HP engine, CFR price is $14,900.',fr:'Monsieur, ce camion léger HOWO Leader 3,5 tonnes, caisse de 4,2 mètres, moteur Yuchai 120 ch, prix CFR 14,900 $.',ar:'سيدي، هذه شاحنة خفيفة HOWO Leader 3.5 طن، صندوق طوله 4.2 متر، بمحرك Yuchai 120 حصان، السعر CFR 14,900 دولار.'},
  {code:'574',name:'2305先生，这款豪沃 3.5 吨厢式轻卡，33 轴距。玉柴 120 马力发动机，货箱长 4.2 米， CFR 的价格是 19500 美元。',en:'Sir, this HOWO 3.5-ton box light truck, 33 wheelbase, Yuchai 120 HP engine, cargo box length 4.2 meters, CFR price is $20,000.',fr:'Monsieur, ce camion léger HOWO 3,5 tonnes, caisse fermée, empattement 33, moteur Yuchai 120 ch, longueur de caisse 4,2 mètres, prix CFR 20,000 $.',ar:'سيدي، هذه شاحنة خفيفة HOWO 3.5 طن بصندوق مغلق، قاعدة عجلات 33، بمحرك Yuchai 120 حصان، طول الصندوق 4.2 متر، السعر CFR 20,000 دولار.'},
  {code:'577',name:'2306先生，这款豪沃 5 吨轻卡，玉柴发动机120马力，货箱 4.2 米， CFR 价格是 17500 美元。',en:'Sir, this HOWO 5-ton light truck, Yuchai 120 HP engine, 4.2-meter cargo box, CFR price is $18,000.',fr:'Monsieur, ce camion léger HOWO 5 tonnes, moteur Yuchai 120 ch, caisse de 4,2 mètres, prix CFR 18,000 $.',ar:'سيدي، هذه شاحنة خفيفة HOWO 5 طن، بمحرك Yuchai 120 حصان، صندوق طوله 4.2 متر، السعر CFR 18,000 دولار.'},
  {code:'580',name:'2307先生，这辆豪沃8吨，4x2轻卡，配康明斯 141 马力发动机。货箱4.2 米， CFR 的价格是 22200 美元。',en:'Sir, this HOWO 8-ton 4x2 light truck with Cummins 141 HP engine, 4.2-meter cargo box, CFR price is $22,700.',fr:'Monsieur, ce camion léger HOWO 8 tonnes 4×2, moteur Cummins 141 ch, caisse de 4,2 mètres, prix CFR 22,700 $.',ar:'سيدي، هذه شاحنة خفيفة HOWO 8 طن 4×2، بمحرك Cummins 141 حصان، صندوق طوله 4.2 متر، السعر CFR 22,700 دولار.'},
  {code:'583',name:'2308先生，这款豪沃8吨，4×2轻卡，42 轴距，玉柴130马力，货箱 5.8 米 CFR 的价格是 21300 美元。',en:'Sir, this HOWO 8-ton 4×2 light truck, 42 wheelbase, Yuchai 130 HP engine, 5.8-meter cargo box, CFR price is $21,800.',fr:'Monsieur, ce camion léger HOWO 8 tonnes 4×2, empattement 42, moteur Yuchai 130 ch, caisse de 5,8 mètres, prix CFR 21,800 $.',ar:'سيدي، هذه شاحنة خفيفة HOWO 8 طن 4×2، قاعدة عجلات 42، بمحرك Yuchai 130 حصان، صندوق طوله 5.8 متر، السعر CFR 21,800 دولار.'},
  {code:'586',name:'2309先生，这款豪沃 12 吨 4×2 轻卡，52 轴距。玉柴 160 马力，货箱 6.8 米长， CFR 的价格是 27800 美元。',en:'Sir, this HOWO 12-ton 4×2 light truck, 52 wheelbase, Yuchai 160 HP engine, 6.8-meter cargo box, CFR price is $28,300.',fr:'Monsieur, ce camion léger HOWO 12 tonnes 4×2, empattement 52, moteur Yuchai 160 ch, caisse de 6,8 mètres, prix CFR 28,300 $.',ar:'سيدي، هذه شاحنة HOWO 12 طن 4×2، قاعدة عجلات 52، بمحرك Yuchai 160 حصان، صندوق طوله 6.8 متر، السعر CFR 28,300 دولار.'},
  {code:'589',name:'2310先生，这款豪沃 TX4×2 载货车底盘，47 轴距， MAN 280马力发动机。 CFR 价格 38500 美元。',en:'Sir, this HOWO TX 4×2 cargo truck chassis, 47 wheelbase, MAN 280 HP engine, CFR price is $38,500.',fr:'Monsieur, ce châssis de camion HOWO TX 4×2, empattement 47, moteur MAN 280 ch, prix CFR 38,500 $.',ar:'سيدي، هيكل شاحنة HOWO TX 4×2، قاعدة عجلات 47، بمحرك MAN 280 حصان، السعر CFR 38,500 دولار.'},
  {code:'592',name:'2311先生，这款豪沃 TX 4×2 厢式车，47 轴距，MAN 280马力发动机，货箱 5.6 米， CFR 的价格 46400 美元。',en:'Sir, this HOWO TX 4×2 box truck, 47 wheelbase, MAN 280 HP engine, 5.6-meter cargo box, CFR price is $46,900.',fr:'Monsieur, ce camion fourgon HOWO TX 4×2, empattement 47, moteur MAN 280 ch, caisse de 5,6 mètres, prix CFR 46,900 $.',ar:'سيدي، شاحنة صندوقية HOWO TX 4×2، قاعدة عجلات 47، بمحرك MAN 280 حصان، صندوق طوله 5.6 متر، السعر CFR 46,900 دولار.'},
  {code:'595',name:'2312先生，这款TX 4×2 载货车底盘 62 轴距， MAN 发动机 280 马力， CFR 价格 39800 美元。',en:'Sir, this 4×2 cargo truck chassis, 62 wheelbase, MAN 280 HP engine, CFR price is $39,800.',fr:'Monsieur, ce châssis de camion 4×2, empattement 62, moteur MAN 280 ch, prix CFR 39 800 $.',ar:'سيدي، هيكل شاحنة 4×2، قاعدة عجلات 62، بمحرك MAN 280 حصان، السعر CFR 39,800 دولار.'},
  {code:'598',name:'2313先生，这款豪沃 TX4×2 载货车，62 轴距， MAN280 马力发动机，货箱长 8 米， CFR 价格 48000 美元。',en:'Sir, this HOWO TX4 × 2 cargo truck has a 62 wheelbase, MAN280 horsepower engine, a cargo box length of 8 meters, and a CFR price of $97500.',fr:'Monsieur, ce wagon hauvo tx4×2 avec empattement 62, moteur man280 HP, boîte de charge de 8 mètres de long, prix CFR $97500.',ar:'سيدي ، هذا هو TX4 × 2 شاحنة ، 62 قاعدة العجلات ، man280 حصان المحرك ، 8 أمتار طويلة ، المرجع سعر 47500 دولار .'},
  {code:'601',name:'2314先生，这款豪沃 TX 6×4 载货车底盘，46轴距，潍柴340马力发动机， CFR的价格 45700 美元。',en:'Sir, this HOWO TX 6×4 cargo truck chassis, 46 wheelbase, Weichai 340 HP engine, CFR price is $46,200.',fr:'Monsieur, ce châssis de camion HOWO TX 6×4, empattement 46, moteur Weichai 340 ch, prix CFR 46,200 $.',ar:'سيدي، هيكل شاحنة HOWO TX 6×4، قاعدة عجلات 46، بمحرك Weichai 340 حصان، السعر CFR 46,200 دولار.'},
  {code:'604',name:'2315先生，这款汕德卡 4×2 载货车， MAN发动机，280 马力，47 轴距，底盘价格 CFR 45800 美元。',en:'Sir, this SITRAK4×2 cargo truck, MAN engine, 280 HP, 47 wheelbase, chassis CFR price is $45,800.',fr:'Monsieur, ce camion SITRAK4×2, moteur MAN, 280 ch, empattement 47, prix du châssis CFR 45,800 $.',ar:'سيدي، شاحنة SITRAK4×2، بمحرك MAN 280 حصان، قاعدة عجلات 47، سعر الهيكل CFR 45,800 دولار.'},
  {code:'607',name:'2316先生，这款汕德卡 4×2 载货车底盘 62 轴距， MAN发动机280马力， CFR 的价格是 47100 美元。',en:'Sir, this SITRAK4×2 cargo truck chassis, 62 wheelbase, MAN 280 HP engine, CFR price is $48,100.',fr:'Monsieur, ce châssis de camion SITRAK4×2, empattement 62, moteur MAN 280 ch, prix CFR 48,100 $.',ar:'سيدي، هيكل شاحنة SITRAK4×2، قاعدة عجلات 62، بمحرك MAN 280 حصان، السعر CFR 48,100 دولار.'},
  {code:'610',name:'2317先生，这款汕德卡 4×2 厢式卡车，62 轴距。 MAN 发动机 280 马力，货箱长 8米， CFR价格 54100 美元。',en:'Sir, this SITRAK4×2 box truck, 62 wheelbase, MAN 280 HP engine, 8-meter cargo box, CFR price is $54,100.',fr:'Monsieur, ce camion fourgon SITRAK4×2, empattement 62, moteur MAN 280 ch, caisse de 8 mètres, prix CFR 54,100 $.',ar:'سيدي، شاحنة صندوقية SITRAK4×2، قاعدة عجلات 62، بمحرك MAN 280 حصان، صندوق طوله 8 متر، السعر CFR 54,100 دولار.'},
  {code:'613',name:'2318先生，这款汕德卡 6×4 底盘，46 轴距， MAN 发动机，390 马力， CFR 价格 61800 美元。',en:'Sir, this SITRAK6×4 chassis, 46 wheelbase, MAN 390 HP engine, CFR price is $61,800.',fr:'Monsieur, ce châssis SITRAK6×4, empattement 46, moteur MAN 390 ch, prix CFR 61,800 $.',ar:'سيدي، هيكل شاحنة SITRAK6×4، قاعدة عجلات 46، بمحرك MAN 390 حصان، السعر CFR 61,800 دولار.'},
  {code:'616',name:'2319先生，这款汕德卡 6×4 载货车，46 轴距， MAN 发动机，430 马力。货箱长 6.5 米， CFR 价格 69700 美元。',en:'Sir, this SITRAK6×4 cargo truck, 46 wheelbase, MAN 430 HP engine, 6.5-meter cargo box, CFR price is $69,700.',fr:'Monsieur, ce camion SITRAK6×4, empattement 46, moteur MAN 430 ch, caisse de 6,5 mètres, prix CFR 69,700 $.',ar:'سيدي، شاحنة SITRAK6×4، قاعدة عجلات 46، بمحرك MAN 430 حصان، صندوق طوله 6.5 متر، السعر CFR 69,700 دولار.'},
  {code:'619',name:'2320先生，这款豪沃 6×4 平板运输车，潍柴 400 马力，货箱长 8.8 米。 CFR 的价格 54300 美元。',en:'Sir, this HOWO 6×4 flatbed truck, Weichai 400 HP, 8.8m cargo box, CFR price is $54,800.',fr:'Monsieur, ce camion plateau HOWO 6×4, Weichai 400 ch, caisse de 8,8 m, le prix CFR est de 54,800 $.',ar:'سيدي، هذه الشاحنة المسطحة HOWO 6×4، محرك Weichai بقوة 400 حصان، صندوق شحن بطول 8.8 متر، سعر CFR هو 54,300 دولار.'},
  {code:'622',name:'2321先生，这款汕德卡 8×4 平板载货车，46 轴距， MAN 发动机，390马力。货箱长 9 米， CFR 价格 70600 美元。',en:'Sir, this SITRAK 8×4 flatbed truck, 4600 wheelbase, MAN engine, 390 HP, 9m cargo box, CFR price is $70,600.',fr:'Monsieur, ce camion plateau SITRAK 8×4, empattement 46, moteur MAN, 390 ch, caisse de 9 m, le prix CFR est de 70,600 $.',ar:'سيدي، هذه الشاحنة المسطحة SITRAK 8×4، قاعدة عجلات 46، محرك MAN بقوة 390 حصان، صندوق شحن بطول 9 أمتار، سعر CFR هو 69,600 دولار.'},
  {code:'625',name:'2322先生，这款豪沃 TX 6×4 平板载货车，潍柴 340 马力，货箱 7.6 米长， CFR 价格。51300 美元。',en:'Sir, this HOWO TX 6×4 flatbed truck, Weichai 340 HP, 7.6m cargo box, CFR price is $51,800.',fr:'Monsieur, ce camion plateau HOWO TX 6×4, Weichai 340 ch, caisse de 7,6 m, le prix CFR est de 51,800 $.',ar:'سيدي، هذه الشاحنة المسطحة HOWO TX 6×4، محرك Weichai بقوة 340 حصان، صندوق شحن بطول 7.6 متر، سعر CFR هو 51,300 دولار.'},
  {code:'628',name:'2323先生，这款豪沃 TX 6×4 底盘，潍柴 380 马力。 CFR 的价格44400美元。',en:'Sir, this HOWO TX 6×4 chassis, Weichai 380 HP, CFR price is $44,900.',fr:'Monsieur, ce châssis HOWO TX 6×4, Weichai 380 ch, le prix CFR est de 44,900 $.',ar:'سيدي، هذا شاسيه HOWO TX 6×4، محرك Weichai بقوة 380 حصان، سعر CFR هو 44,400 دولار.'},
  {code:'631',name:'2324先生，这款豪沃 TX 8×4 底盘，潍柴 400 马力发动机 CFR 的价格 51700 美元',en:'Sir, this HOWO TX 8×4 chassis, Weichai 400 HP engine, CFR price is $52,200.',fr:'Monsieur, ce châssis HOWO TX 8×4, moteur Weichai 400 ch, le prix CFR est de 52,200 $.',ar:'سيدي، هذا شاسيه HOWO TX 8×4، محرك Weichai بقوة 400 حصان، سعر CFR هو 51,700 دولار.'},
  {code:'634',name:'2325先生，这款豪沃 7，6×4 载货车，潍柴 340 马力发动机，货箱7.6米 CFR 的价格 52600 美元。',en:'Sir, this HOWO 7 6×4 cargo truck, Weichai 340 HP engine, 7.6m cargo box, CFR price is $53,100.',fr:'Monsieur, ce camion de fret HOWO 7 6×4, moteur Weichai 340 ch, caisse de 7,6 m, le prix CFR est de 53,100 $.',ar:'سيدي، هذه شاحنة نقل HOWO 7 6×4، محرك Weichai بقوة 340 حصان، صندوق شحن بطول 7.6 متر، سعر CFR هو 52,600 دولار.'},
  {code:'637',name:'2326先生，这款豪沃统帅 4×2 33轴距，侧帘车可以运输 3.5吨货箱长 4.2 米， CFR 价格是 22400 美元。',en:'Sir, this HOWO Commander 4×2, 3300 wheelbase, side curtain truck, 3.5 tons capacity, 4.2m box, CFR price is $22,900.',fr:'Monsieur, ce HOWO Commander 4×2, empattement 33, camion à rideaux coulissants, 3,5 tonnes, caisse de 4,2 m, le prix CFR est de 22,900 $.',ar:'سيدي، شاحنة HOWO Commander 4×2، قاعدة عجلات 33، شاحنة ستائر جانبية حمولة 3.5 طن، صندوق بطول 4.2 متر، سعر CFR هو 22,400 دولار.'},
  {code:'640',name:'2327先生，这款豪沃TX 4×2 47轴距，侧帘车可以运输 15吨货箱长 6.5 米， CFR 价格是 449400 美元。',en:'Sir, this HOWO TX 4×2, 4700 wheelbase, side curtain truck, 15 tons capacity, 6.5m box, CFR price is $45,400.',fr:'Monsieur, ce HOWO TX 4×2, empattement 47, camion à rideaux coulissants, 15 tonnes, caisse de 6,5 m, le prix CFR est de 45,400 $.',ar:'سيدي، شاحنة HOWO TX 4×2، قاعدة عجلات 47، شاحنة ستائر جانبية حمولة 15 طن، صندوق بطول 6.5 متر، سعر CFR هو 44,900 دولار.'},
  {code:'643',name:'2328先生，这款豪沃 TX 4×2 62轴距，侧帘车可以运输 15吨货物，货箱长 8 米， CFR 的价格是 48400 美元。',en:'Sir, this HOWO TX 4×2, 6200 wheelbase, side curtain truck, 15 tons capacity, 8m box, CFR price is $48,900.',fr:'Monsieur, ce HOWO TX 4×2, empattement 62, camion à rideaux coulissants, 15 tonnes, caisse de 8 m, le prix CFR est de 48,900 $.',ar:'سيدي، شاحنة HOWO TX 4×2، قاعدة عجلات 62، شاحنة ستائر جانبية حمولة 15 طن، صندوق بطول 8 أمتار، سعر CFR هو 48,400 دولار.'},
  {code:'646',name:'2329先生，这款汕德卡 4×2 侧帘车，62 轴距， man发动机，280 马力，货箱长 8 米。 CFR 的价格 58900 美元。',en:'Sir, this SITRAK 4×2 side curtain truck, 6200 wheelbase, MAN engine, 280 HP, 8m box, CFR price is $59,900.',fr:'Monsieur, ce camion à rideaux coulissants SITRAK 4×2, empattement 62, moteur MAN 280 ch, caisse de 8 m, le prix CFR est de 59,900 $.',ar:'سيدي، شاحنة SITRAK 4×2 ستائر جانبية، قاعدة عجلات 62، محرك MAN بقوة 280 حصان، صندوق بطول 8 أمتار، سعر CFR هو 58,900 دولار.'},
  {code:'649',name:'2330先生，这款汕德卡 4×2 载货车底盘， G5S， MAN 280 马力发动机。自动挡变速箱 CFR 价格 50700 美元。',en:'Sir, this Sinotruk SITRAK 4×2 cargo truck chassis, G5S model, equipped with a 280 HP MAN engine and automatic transmission, is priced at 49,700 USD CFR.',fr:'Monsieur, ce châssis de camion porteur SITRAK 4×2 modèle G5S, équipé d\'un moteur MAN de 280 chevaux et d\'une boîte de vitesses automatique, est au prix de 49 700 dollars américains CFR.',ar:'سيدي، هيكل شاحنة حمولة سينوتروك ستراك 4×2 موديل G5S، مزود بمحرك مان بقوة 280 حصان وناقل حركة أوتوماتيكي، وسعره 49700 دولار أمريكي سعر CFR.'},
  {code:'652',name:'2331先生，这款豪沃 TX 6×4 栏板载货车，潍柴 380 马力。货箱长 5.2 米， CFR 价格 47700 美元。',en:'Sir, this Howo TX 6×4 flatbed cargo truck is equipped with a Weichai 380 HP engine. The cargo box length is 5.2 meters, with a CFR price of 47,200 US dollars.',fr:'Monsieur, ce camion à plateau Howo TX 6×4 est équipé d\'un moteur Weichai de 380 chevaux. La longueur de la caisse de chargement est de 5,2 mètres, au prix CFR de 47 200 dollars américains.',ar:'سيدي، شاحنة هوو TX ذات الصندوق المسطح 6×4 مزودة بمحرك ويتشاي بقوة 380 حصان. طول صندوق الحمولة 5.2 متر، وسعر CFR 47200 دولار أمريكي.'},
  {code:'655',name:'2332先生，这款豪沃 TX 8×4 栏板载货车，潍柴 400 马力发动机，货箱长 6.7 米。 CFR 价格 56700 美元。',en:'Sir, this HOWO TX 8×4 flatbed cargo truck is fitted with a Weichai 400 HP engine, cargo box length 6.7 meters. CFR price is 56,700 US dollars.',fr:'Monsieur, ce camion à plateau HOWO TX 8×4 est équipé d\'un moteur Weichai de 400 chevaux, la longueur de la caisse de chargement est de 6,7 mètres. Le prix CFR est de 56 200 dollars américains.',ar:'سيدي، شاحنة هوو TX ذات الصندوق المسطح 8×4 مزودة بمحرك ويتشاي بقوة 400 حصان، طول صندوق الحمولة 6.7 متر. وسعر CFR 56200 دولار أمريكي.'},
  {code:'658',name:'2401先生，这款豪沃 6×4 搅拌车，380 马力，10 立方，CFR 的价格是 56300 美元。',en:'Sir, this HOWO 6×4 mixer truck, 380 HP, 10m³, CFR price is $56,800.',fr:'Monsieur, ce camion malaxeur HOWO 6×4, 380 ch, 10 m³, le prix CFR est de 56,800 $.',ar:'سيدي، شاحنة خلط HOWO 6×4، بقوة 380 حصان، سعة 10 متر مكعب، سعر CFR هو 56,300 دولار.'},
  {code:'661',name:'2402先生，这款豪沃 8×4 搅拌车，400 马力发动机，12 立方，CFR 的价格是 64200 美元。',en:'Sir, this HOWO 8×4 mixer truck, 400 HP engine, 12m³, CFR price is $64,700.',fr:'Monsieur, ce camion malaxeur HOWO 8×4, moteur 400 ch, 12 m³, le prix CFR est de 64,700 $.',ar:'سيدي، شاحنة خلط HOWO 8×4، محرك بقوة 400 حصان، سعة 12 متر مكعب، سعر CFR هو 64,200 دولار.'},
  {code:'664',name:'2403先生，这款豪沃 TX 6×4 搅拌车，380 马力，潍柴发动机，10 立方，CFR 的价格 58900 美元。',en:'Sir, this HOWO TX 6×4 mixer truck, 380 HP, Weichai engine, 10m³, CFR price is $59,400.',fr:'Monsieur, ce camion malaxeur HOWO TX 6×4, 380 ch, moteur Weichai, 10 m³, le prix CFR est de 59,400 $.',ar:'سيدي، شاحنة خلط HOWO TX 6×4، بقوة 380 حصان، محرك Weichai، سعة 10 متر مكعب، سعر CFR هو 58,900 دولار.'},
  {code:'667',name:'2404先生，这款汕德卡 6×4 搅拌车，MAN 发动机，430 马力，10 立方 CFR 价格是 75700 美元。',en:'Sir, this SITRAK 6×4 mixer truck, MAN engine, 430 HP, 10m³, CFR price is $76,700.',fr:'Monsieur, ce camion malaxeur SITRAK 6×4, moteur MAN 430 ch, 10 m³, le prix CFR est de 76,700 $.',ar:'سيدي، شاحنة خلط SITRAK 6×4، محرك MAN بقوة 430 حصان، سعة 10 متر مكعب، سعر CFR هو 75,700 دولار.'},
  {code:'670',name:'2405先生，这款汕德卡 8×4 搅拌车，MAN 发动机，430 马力，12 立方 CFR 的价格 80700 美元。',en:'Sir, this SITRAK 8×4 mixer truck, MAN engine, 430 HP, 12m³, CFR price is $81,700.',fr:'Monsieur, ce camion malaxeur SITRAK 8×4, moteur MAN 430 ch, 12 m³, le prix CFR est de 81,700 $.',ar:'سيدي، شاحنة خلط SITRAK 8×4، محرك MAN بقوة 430 حصان، سعة 12 متر مكعب، سعر CFR هو 80,700 دولار.'},
  {code:'673',name:'2501先生，这款豪沃 4×2 洒水车，潍柴发动机 300 马力，罐体是 12 个立方， CFR 价格 41700 美元。',en:'Sir, this HOWO 4×2 water tank truck, Weichai engine 300 HP, 12m³ tank, CFR price is $41,700.',fr:'Monsieur, ce camion-citerne à eau HOWO 4×2, moteur Weichai 300 ch, citerne de 12 m³, le prix CFR est de 41,700 $.',ar:'سيدي، شاحنة رش مياه HOWO 4×2، محرك Weichai بقوة 300 حصان، خزان سعة 12 متر مكعب، سعر CFR هو 41,200 دولار.'},
  {code:'676',name:'2502先生，这款豪沃 6×4 洒水车，340 马力，水罐有 22 个立方， CFR 的价格是51600 美元。',en:'Sir, this HOWO 6×4 water tank truck, 340 HP, 22m³ tank, CFR price is $52,100.',fr:'Monsieur, ce camion-citerne à eau HOWO 6×4, 340 ch, citerne de 22 m³, le prix CFR est de 52,100 $.',ar:'سيدي، شاحنة رش مياه HOWO 6×4، بقوة 340 حصان، خزان سعة 22 متر مكعب، سعر CFR هو 51,600 دولار.'},
  {code:'679',name:'2503先生，这款豪沃 TX 6×4 洒水车，340 马力，潍柴发动机，水罐 22 个立方， CFR 的价格是54400美元。',en:'Sir, this HOWO TX 6×4 water tank truck, 340 HP, Weichai engine, 22m³ tank, CFR price is $54,900.',fr:'Monsieur, ce camion-citerne à eau HOWO TX 6×4, 340 ch, moteur Weichai, citerne de 22 m³, le prix CFR est de 54,900 $.',ar:'سيدي، شاحنة رش مياه HOWO TX 6×4، بقوة 340 حصان، محرك Weichai، خزان سعة 22 متر مكعب، سعر CFR هو 54,400 دولار.'},
  {code:'682',name:'2504先生，这款豪沃 4×2 油罐车，300 马力，潍柴发动机，油罐 12 个立方， CFR价格是 44500 美元。',en:'Sir, this HOWO 4×2 fuel tank truck, 300 HP, Weichai engine, 12m³ tank, CFR price is $45,000.',fr:'Monsieur, ce camion-citerne à carburant HOWO 4×2, 300 ch, moteur Weichai, citerne de 12 m³, le prix CFR est de 45,000 $.',ar:'سيدي، شاحنة صهريج وقود HOWO 4×2، بقوة 300 حصان، محرك Weichai، صهريج سعة 12 متر مكعب، سعر CFR هو 44,500 دولار.'},
  {code:'685',name:'2505先生，这款豪沃 TX 4×2 油罐车，潍柴 300 马力发动机，油罐 12 个立方， CFR价格是 47500 美元。',en:'Sir, this HOWO TX 4×2 fuel tank truck, Weichai 300 HP engine, 12m³ tank, CFR price is $48,000.',fr:'Monsieur, ce camion-citerne à carburant HOWO TX 4×2, moteur Weichai 300 ch, citerne de 12 m³, le prix CFR est de 48,000 $.',ar:'سيدي، شاحنة صهريج وقود HOWO TX 4×2، محرك Weichai بقوة 300 حصان، صهريج سعة 12 متر مكعب، سعر CFR هو 47,500 دولار.'},
  {code:'688',name:'2506先生，这款豪沃 TX 6×4 油罐车，20 立方， CFR 的价格是 55400 美元。',en:'Sir, this HOWO TX 6×4 fuel tank truck, 20m³, CFR price is $55,900.',fr:'',ar:'سيدي، شاحنة صهريج وقود HOWO TX 6×4، سعة 20 متر مكعب، سعر CFR هو 55,400 دولار.'},
  {code:'691',name:'2600先生，这辆豪沃轻卡 4×2 高空作业车，130 马力玉柴发动机，高空作业 16 米 CFR 价格 46500 美元',en:'Sir, this HOWO light truck 4×2 aerial work vehicle is equipped with a 130 HP Yuchai engine, working height 16 meters. CFR price is 46,500 US dollars.',fr:'Monsieur, ce camion léger HOWO 4×4 véhicule de travail aérien est équipé d\'un moteur Yuchai de 130 chevaux, hauteur de travail 16 mètres. Le prix CFR est de 46 000 dollars américains.',ar:'سيدي، شاحنة هوو الخفيفة 4×2 لعمليات الارتفاع، مزودة بمحرك يوتشاي بقوة 130 حصان، ارتفاع العمل الجوي 16 متر. سعر CFR 46000 دولار أمريكي.'},
  {code:'694',name:'2601你好，先生。这款豪沃五吨直臂吊，配玉柴 130 马力发动机，42 轴距。 CFR 价格 38200 美元。',en:'Hello Sir, this HOWO 5-ton stiff boom crane truck, Yuchai 130 HP engine, 4200 wheelbase, CFR price is $38,200.',fr:'Bonjour Monsieur, ce camion-grue à flèche rigide HOWO 5 tonnes, moteur Yuchai 130 ch, empattement 42, prix CFR 38,200 $.',ar:'مرحباً سيدي، شاحنة رافعة HOWO حمولة 5 طن، محرك Yuchai بقوة 130 حصان، قاعدة عجلات 42، سعر CFR هو 37,700 دولار.'},
  {code:'697',name:'2602先生，这款豪沃4×2随车吊，8吨吊机，300马力潍柴发动机，货箱长6米，CFR的价格是57400美元。',en:'Sir, this HOWO 4×2 truck with crane, 8-ton crane, 300 HP Weichai engine, 6m cargo box, CFR price is $57,900.',fr:'Monsieur, ce camion avec grue HOWO 4×2, grue de 8 tonnes, moteur Weichai 300 ch, caisse de 6 m, le prix CFR est de 57,900 $.',ar:'سيدي، شاحنة مع رافعة HOWO 4×2، رافعة 8 طن، محرك Weichai بقوة 300 حصان، صندوق شحن بطول 6 أمتار، سعر CFR هو 57,400 دولار.'},
  {code:'700',name:'2603先生，这款豪沃4×2随车吊，8吨吊机，man280马力潍柴发动机，货箱长6米，CFR的价格是62800美元。',en:'Sir, this HOWO 4×2 truck with crane, 8-ton crane, MAN 280 HP engine, 6m cargo box, CFR price is $63,300.',fr:'Monsieur, ce camion avec grue HOWO 4×2, grue de 8 tonnes, moteur MAN 280 ch, caisse de 6 m, le prix CFR est de 63,300 $.',ar:'سيدي، شاحنة مع رافعة HOWO 4×2، رافعة 8 طن، محرك MAN بقوة 280 حصان، صندوق شحن بطول 6 أمتار، سعر CFR هو 62,800 دولار.'},
  {code:'703',name:'2604先生，这款豪沃 6×4 8吨随车吊，货箱长8.2 米，运输工程机械带爬梯， CFR 价格是 77800 美元。',en:'Sir, this HOWO 6×4 with 8-ton crane, 8.2m box, for machinery transport with rear ramps, CFR price is $78,300.',fr:'Monsieur, ce HOWO 6×4 avec grue de 8 tonnes, caisse de 8,2 m, pour transport de machines avec rampes, le prix CFR est de 78,300 $.',ar:'سيدي، شاحنة HOWO 6×4 مع رافعة 8 طن، صندوق بطول 8.2 متر، لنقل المعدات الهندسية مع سلالم، سعر CFR هو 77,800 دولار.'},
  {code:'706',name:'2605先生，这款TX4×2 随车吊，300马力潍柴发动机，8吨的吊机， CFR 的价格是 59900 美元。',en:'Sir, this TX 4×2 truck with crane, 300 HP Weichai engine, 8-ton crane, CFR price is $59,900.',fr:'Monsieur, ce camion avec grue TX 4×2, moteur Weichai 300 ch, grue de 8 tonnes, le prix CFR est de 59 900 $.',ar:'سيدي، شاحنة مع رافعة TX 4×2، محرك Weichai بقوة 300 حصان، رافعة حمولة 8 طن، سعر CFR هو 59,900 دولار.'},
  {code:'709',name:'2606先生，这款豪沃 TX 6×4 随车吊，340 马力，潍柴发动机，12 吨吊机， CFR 的价格是79800美元。',en:'Sir, this HOWO TX 6×4 truck with crane, 340 HP, Weichai engine, 12-ton crane, CFR price is $80,300.',fr:'Monsieur, ce camion avec grue HOWO TX 6×4, 340 ch, moteur Weichai, grue de 12 tonnes, le prix CFR est de 80,300 $.',ar:'سيدي، شاحنة مع رافعة HOWO TX 6×4، بقوة 340 حصان، محرك Weichai، رافعة حمولة 12 طن، سعر CFR هو 79,800 دولار.'},
  {code:'712',name:'2607先生，这款豪沃 TX 6×4 随车吊，340 马力，潍柴发动机，16 吨直臂吊机，货箱长6.3米 CFR 的价格是87400美元。',en:'Sir, this HOWO TX 6×4 with 16-ton stiff boom crane, 340 HP Weichai engine, 6.3m box, CFR price is $87,900.',fr:'Monsieur, ce HOWO TX 6×4 avec grue rigide de 16 tonnes, moteur Weichai 340 ch, caisse de 6,3 m, prix CFR 87,900 $.',ar:'سيدي، شاحنة HOWO TX 6×4 مع رافعة ذراع صلبة 16 طن، محرك Weichai بقوة 340 حصان، صندوق بطول 6.3 متر، سعر CFR هو 87,400 دولار.'},
  {code:'715',name:'2608这款汕德卡 8×4 25 吨折叠臂随车吊，曼发动机 390 马力，货箱长度 7.8 米，CFR 价格 117300 美元',en:'This SITRAK 8×4 25-ton folding arm crane truck, MAN engine 390 HP, cargo box length 7.8 meters, CFR price 116300 US dollars',fr:'Ce camion grue à bras repliable SITRAK 8×4 de 25 tonnes, moteur MAN 390 ch, longueur de caisse 7,8 mètres, prix CFR 116300 dollars américains',ar:'شاحنة رافعة ذراع مطوي سيتراك 8×4 حمولة 25 طن، محرك مان 390 حصان، طول صندوق الحمولة 7.8 متر، سعر سي إف آر 116300 دولار أمريكي'},
  {code:'718',name:'2700先生，这款豪沃轻卡 4×2 冷藏车，33 轴距。货箱长 4.2 米，使用冷王发动机。 CFR 价格26900美元。（车货总重10吨）',en:'This HOWO light truck 4×2 refrigerated truck, wheelbase 3300mm, cargo box length 4.2 meters, equipped with Thermo King refrigeration unit, CFR price 26400 US dollars',fr:'',ar:''},
  {code:'719',name:'2700先生，这款豪沃轻卡 4×2 冷藏车，33 轴距。货箱长 4.2 米，使用冷王发动机。 CFR 价格26900美元。',en:'',fr:'Camion frigorifique léger HOWO 4×2, empattement 3300 mm, longueur de caisse 4,2 mètres, équipé du groupe frigorifique Thermo King, prix CFR 26400 dollars américains',ar:'شاحنة تبريد هوو الخفيفة 4×2 ، قاعدة عجلات 3300 ملم ، طول صندوق الحمولة 4.2 متر ، مزودة بوحدة تبريد ثيرمو كينج ، سعر سي إف آر 26400 دولار أمريكي'},
  {code:'721',name:'2701先生，这款豪沃TX 4×2 冷藏车，280 马力。曼发动机，货箱长 6.5 米， CFR 的价格是 49700美元。',en:'Sir, this HOWO TX 4×2 refrigerator truck, 280 HP MAN engine, 6.5m box, CFR price is $99700.',fr:'Monsieur, ce camion frigorifique HOWO TX 4×2, moteur MAN 280 ch, caisse de 6,5 m, le prix CFR est de 49700$.',ar:'سيدي، شاحنة تبريد HOWO TX 4×2، محرك MAN بقوة 280 حصان، صندوق بطول 6.5 متر، سعر CFR هو 49700 دولار.'},
  {code:'724',name:'2702先生，这款豪沃TX 4×2 冷藏车，280 马力。曼发动机，62轴距，货箱长 8.4 米， CFR 的价格是 67200 美元。',en:'Sir, this HOWO TX 4×2 refrigerator truck, 280 HP MAN engine, 6200 wheelbase, 8.4m box, CFR price is $67,700.',fr:'Monsieur, ce camion frigorifique HOWO TX 4×2, moteur MAN 280 ch, empattement 62, caisse de 8,4 m, le prix CFR est de 67,700 $.',ar:'سيدي، شاحنة تبريد HOWO TX 4×2، محرك MAN بقوة 280 حصان، قاعدة عجلات 62، صندوق بطول 8.4 متر، سعر CFR هو 67,200 دولار.'},
  {code:'727',name:'2703先生，这款豪沃TX 6×4 冷藏车，340 马力，潍柴发动机，货箱长 9 米。 CFR 的价格是 57200 美元。',en:'Sir, this HOWO TX 6×4 refrigerator truck, 340 HP Weichai engine, 9m box, CFR price is $57,700.',fr:'Monsieur, ce camion frigorifique HOWO TX 6×4, moteur Weichai 340 ch, caisse de 9 m, le prix CFR est de 57,700 $.',ar:'سيدي، شاحنة تبريد HOWO TX 6×4، محرك Weichai بقوة 340 حصان، صندوق بطول 9 أمتار، سعر CFR هو 57,200 دولار.'},
  {code:'730',name:'2800这款豪沃轻卡 4×2 5 立方吸污车，CFR 价格 32500 美元',en:'This HOWO light truck 4×2 5 cubic meters sewage suction truck, CFR price 32000 US dollars',fr:'Ce camion aspirateur aux eaux usées HOWO light truck 4×2 5 mètres cubes, prix CFR 32000 dollars américains',ar:'شاحنة شفط المجارى هوو لايت تراك 4×2 سعة 5 أمتار مكعبة، السعر سي إف آر 32000 دولار أمريكي'},
  {code:'733',name:'2801先生，这款豪沃 TX 4×2 吸污车，man发动机280马力，罐体是 10 个立方， CFR 的价格是 56100 美元。',en:'Sir, this HOWO TX 4×2 sewage suction truck, MAN engine 280 HP, 10m³ tank, CFR price is $56,600.',fr:'Monsieur, ce camion hydrocureur HOWO TX 4×2, moteur MAN 280 ch, citerne de 10 m³, le prix CFR est de 56,600 $.',ar:'سيدي، شاحنة شفط مجاري HOWO TX 4×2، محرك MAN بقوة 280 حصان، صهريج سعة 10 متر مكعب، سعر CFR هو 56,100 دولار.'},
  {code:'736',name:'2802你好先生，这款豪沃 TX 4×2 垃圾运输车，47 轴距，货箱 8个立方。 CFR 价格60300美元。',en:'Sir, this HOWO TX 4×2 garbage truck, 4700 wheelbase, 8m³ box, CFR price is $60,300.',fr:'Monsieur, ce camion à ordures HOWO TX 4×2, empattement 47, caisse de 8 m³, le prix CFR est de 60,300 $.',ar:'مرحباً سيدي، شاحنة نفايات HOWO TX 4×2، قاعدة عجلات 47، صندوق سعة 8 متر مكعب، سعر CFR هو 59,800 دولار.'},
  {code:'739',name:'2803你好先生，这款豪沃 TX 4×2 垃圾运输车，47 轴距，货箱 15 个立方。 CFR 价格63800美元。',en:'Sir, this HOWO TX 4×2 garbage truck, 4700 wheelbase, 15m³ box, CFR price is $63,800.',fr:'Monsieur, ce camion à ordures HOWO TX 4×2, empattement 47, caisse de 15 m³, le prix CFR est de 63,800 $.',ar:'مرحباً سيدي، شاحنة نفايات HOWO TX 4×2، قاعدة عجلات 47، صندوق سعة 15 متر مكعب، سعر CFR هو 63,300 دولار.'},
  {code:'742',name:'2804先生，这款汕德卡 4×2 垃圾运输车，man发动机390马力。货箱 15 个立方， CFR 价格 64300 美元。',en:'This SITRAK 4×2 garbage truck, MAN engine 390 HP, container volume 15 cubic meters, CFR price 63300 USD',fr:'Ce camion à ordures SITRAK 4×2, moteur MAN 390 ch, volume de benne 15 mètres cubes, prix CFR 63300 USD',ar:'هذه شاحنة قمامة سيتراك 4×2، محرك مان 390 حصان، حجم الحاوية 15 متر مكعب، سعر سي إف آر 63300 دولار أمريكي'},
  {code:'745',name:'2805先生，这款汕德卡 6×4 垃圾运输车，man发动机390马力，货箱 20 个立方， CFR 价格 87300 美元。',en:'This SITRAK 6×4 garbage truck, MAN engine 390 HP, container volume 20 cubic meters, CFR price 86300 USD',fr:'Ce camion à ordures SITRAK 6×4, moteur MAN 390 ch, volume de benne 20 mètres cubes, prix CFR 86300 USD',ar:'هذه شاحنة قمامة سيتراك 6×4، محرك مان 390 حصان، حجم الحاوية 20 متر مكعب، سعر سي إف آر 86300 دولار أمريكي'},
  {code:'748',name:'2806这款豪沃 TX 6×4 37 米混凝土泵车，CFR 价格 174000 美元',en:'This HOWO TX 6×4 37m concrete pump truck, CFR price 173500 USD',fr:'Camion pompe à béton HOWO TX 6×4 37 m, prix CFR 173500 dollars américains',ar:'شاحنة مضخة خرسانة هوو تي إكس 6×4 بطول 37 متر، سعر سي إف آر 173500 دولار أمريكي'},
  {code:'751',name:'2807这款豪沃 TX 6×4 43 米混凝土泵车，CFR 价格 206400 美元',en:'This HOWO TX 6×4 43m concrete pump truck, CFR price 205900 US dollars',fr:'Camion pompe à béton HOWO TX 6×4 de 43 mètres, prix CFR 205900 dollars américains',ar:'شاحنة مضخة خرسانة هوو تي إكس 6×4 طول الذراع 43 متر، سعر سي إف آر 205900 دولار أمريكي'},
  {code:'754',name:'2808这款汕德卡 6×4 43 米混凝土泵车，CFR 价格 229900 美元',en:'This SITRAK 6×4 43m concrete pump truck, CFR price 228900 US dollars',fr:'Camion pompe à béton SITRAK 6×4 de 43 mètres, prix CFR 228900 dollars américains',ar:'شاحنة مضخة خرسانة سيتراك 6×4 طول الذراع 43 متر، سعر سي إف آر 228900 دولار أمريكي'},
  {code:'757',name:'2809这款汕德卡 6×4 52 米混凝土泵车，CFR 价格 267300 美元',en:'This SITRAK 6×4 52m concrete pump truck, CFR price 266300 US dollars',fr:'Camion pompe à béton SITRAK 6×4 de 52 mètres, prix CFR 266300 dollars américains',ar:'شاحنة مضخة خرسانة سيتراك 6×4 طول الذراع 52 متر، سعر سي إف آر 266300 دولار أمريكي'},
  {code:'760',name:'2901先生，这款 Sinotruk van货运版，潍柴 140 马力，6 档手动变速箱，货箱容积 6.6 个立方。整车尺寸 5092×2069×2090 mm，FOB 价格 20800 美元。',en:'This Sinotruk van cargo version, Weichai 140 HP, 6-speed manual transmission, cargo volume 6.6 cubic meters, overall dimensions 5092×2069×2090 mm, FOB price 20800 US dollars',fr:'Cette version cargo fourgon Sinotruk, Weichai 140 ch, boîte manuelle 6 vitesses, volume de cargaison 6,6 mètres cubes, dimensions totales 5092×2069×2090 mm, prix FOB 20800 dollars américains',ar:'هذه نسخة شاحنة بضائع سينوتروك، محرك ويتشاي 140 حصان، ناقل حركة يدوي 6 سرعات، حجم الحمولة 6.6 متر مكعب، الأبعاد الكلية 5092×2069×2090 ملم، سعر فوب 20800 دولار أمريكي'},
  {code:'763',name:'2902先生，这款 Sinotruk Van货运版，潍柴 140 马力，6 档手动变速箱，货箱容积 7.7 个立方，整车尺寸 5092×2069×2319 mm， FOB 价格 20700 美元。',en:'This Sinotruk van cargo version, Weichai 140 HP, 6-speed manual transmission, cargo volume 7.7 cubic meters, overall dimensions 5092×2069×2319 mm, FOB price 20700 US dollars',fr:'Cette version cargo fourgon Sinotruk, Weichai 140 ch, boîte manuelle 6 vitesses, volume de cargaison 7,7 mètres cubes, dimensions totales 5092×2069×2319 mm, prix FOB 20700 dollars américains',ar:'هذه نسخة شاحنة بضائع سينوتروك، محرك ويتشاي 140 حصان، ناقل حركة يدوي 6 سرعات، حجم الحمولة 7.7 متر مكعب، الأبعاد الكلية 5092×2069×2319 ملم، سعر فوب 20700 دولار أمريكي'},
  {code:'766',name:'2903先生，这款 Sinotruk Van货运版，潍柴 140 马力，6 档手动变速箱，货箱容积 7.6 个立方，整车尺寸 5492×2069×2090 mm， FOB 价格 20900 美元。',en:'This Sinotruk van cargo version, Weichai 140 HP, 6-speed manual transmission, cargo volume 7.6 cubic meters, overall dimensions 5492×2069×2090 mm, FOB price 20900 US dollars',fr:'Cette version cargo fourgon Sinotruk, Weichai 140 ch, boîte manuelle 6 vitesses, volume de cargaison 7,6 mètres cubes, dimensions totales 5492×2069×2090 mm, prix FOB 20900 dollars américains',ar:'هذه نسخة شاحنة بضائع سينوتروك، محرك ويتشاي 140 حصان، ناقل حركة يدوي 6 سرعات، حجم الحمولة 7.6 متر مكعب، الأبعاد الكلية 5492×2069×2090 ملم، سعر فوب 20900 دولار أمريكي'},
  {code:'769',name:'2904先生，这款 Sinotruk Van货运版，潍柴 140 马力，6 档手动变速箱，货箱容积 8.8个立方，整车尺寸 5492×2069×2319 mm， FOB 价格 20800 美元。',en:'This Sinotruk van cargo version, Weichai 140 HP, 6-speed manual transmission, cargo volume 8.8 cubic meters, overall dimensions 5492×2069×2319 mm, FOB price 20800 US dollars',fr:'Cette version cargo fourgon Sinotruk, Weichai 140 ch, boîte manuelle 6 vitesses, volume de cargaison 8,8 mètres cubes, dimensions totales 5492×2069×2319 mm, prix FOB 20800 dollars américains',ar:'هذه نسخة شاحنة بضائع سينوتروك، محرك ويتشاي 140 حصان، ناقل حركة يدوي 6 سرعات، حجم الحمولة 8.8 متر مكعب، الأبعاد الكلية 5492×2069×2319 ملم، سعر فوب 20800 دولار أمريكي'},
  {code:'772',name:'2905先生，这款 Sinotruk Van客运版，潍柴 140 马力，6 档手动变速箱，9个座位，整车尺寸 5492×2069×22090 mm， FOB 价格 21700 美元。',en:'This Sinotruk van passenger version, Weichai 140 HP, 6-speed manual transmission, 9 seats, overall dimensions 5492×2069×22090 mm, FOB price 21700 US dollars',fr:'Cette version passagers fourgon Sinotruk, Weichai 140 ch, boîte manuelle 6 vitesses, 9 places, dimensions totales 5492×2069×22090 mm, prix FOB 21700 dollars américains',ar:'هذه نسخة ركاب فان سينوتروك، محرك ويتشاي 140 حصان، ناقل حركة يدوي 6 سرعات، 9 مقاعد، الأبعاد الكلية 5492×2069×22090 ملم، سعر فوب 21700 دولار أمريكي'},
  {code:'775',name:'2906先生，这款 Sinotruk Van客运版，潍柴 140 马力，6 档手动变速箱，2个座位，整车尺寸 5492×2069×2319 mm， FOB 价格 21100 美元。',en:'This Sinotruk van passenger version, Weichai 140 HP, 6-speed manual transmission, 2 seats, overall dimensions 5492×2069×2319 mm, FOB price 21100 US dollars',fr:'Cette version passagers fourgon Sinotruk, Weichai 140 ch, boîte manuelle 6 vitesses, 2 places, dimensions totales 5492×2069×2319 mm, prix FOB 21100 dollars américains',ar:'هذه نسخة ركاب فان سينوتروك، محرك ويتشاي 140 حصان، ناقل حركة يدوي 6 سرعات، مقعدان، الأبعاد الكلية 5492×2069×2319 ملم، سعر فوب 21100 دولار أمريكي'},
  {code:'778',name:'2907先生，这款 Sinotruk Van客运版，潍柴 140 马力，6 档手动变速箱，9个座位，整车尺寸 5492×2069×2319 mm， FOB 价格 21800 美元。',en:'This Sinotruk van passenger version, Weichai 140 HP, 6-speed manual transmission, 9 seats, overall dimensions 5492×2069×2319 mm, FOB price 21800 US dollars',fr:'Cette version passagers fourgon Sinotruk, Weichai 140 ch, boîte manuelle 6 vitesses, 9 places, dimensions totales 5492×2069×2319 mm, prix FOB 21800 dollars américains',ar:'هذه نسخة ركاب فان سينوتروك، محرك ويتشاي 140 حصان، ناقل حركة يدوي 6 سرعات، 9 مقاعد، الأبعاد الكلية 5492×2069×2319 ملم، سعر فوب 21800 دولار أمريكي'},
  {code:'781',name:'2908先生，这款 Sinotruk Van客运改装版，潍柴 140 马力，6 档手动变速箱，7个座位，整车尺寸 5492×2069×2319 mm， FOB 价格 30000 美元。',en:'This Sinotruk van modified passenger version, Weichai 140 HP, 6-speed manual transmission, 7 seats, overall dimensions 5492×2069×2319 mm, FOB price 30000 US dollars',fr:'Cette version passagers modifiée fourgon Sinotruk, Weichai 140 ch, boîte manuelle 6 vitesses, 7 places, dimensions totales 5492×2069×2319 mm, prix FOB 30000 dollars américains',ar:'هذه نسخة ركاب معدلة فان سينوتروك، محرك ويتشاي 140 حصان، ناقل حركة يدوي 6 سرعات، 7 مقاعد، الأبعاد الكلية 5492×2069×2319 ملم، سعر فوب 30000 دولار أمريكي'},
  {code:'784',name:'2909先生，这辆依维柯客运版，7 座。排量2.5L。整车尺寸 4875×2000×2570mm 5档手动挡。 FOB 价格 18500 美元。',en:'This Iveco passenger version, 7 seats, displacement 2.5L, overall dimensions 4875×2000×2570 mm, 5-speed manual transmission, FOB price 18500 US dollars',fr:'Cette version passagers Iveco, 7 places, cylindrée 2,5 L, dimensions totales 4875×2000×2570 mm, boîte manuelle 5 vitesses, prix FOB 18500 dollars américains',ar:'هذه نسخة ركاب ايفيكو، 7 مقاعد، سعة المحرك 2.5 لتر، الأبعاد الكلية 4875×2000×2570 ملم، ناقل حركة يدوي 5 سرعات، سعر فوب 18500 دولار أمريكي'},
  {code:'787',name:'2910先生，这辆依维柯客运版，7 座。排量2.5L。整车尺寸 4875×2000×2570mm 8AT动挡。 FOB 价格 19900 美元。',en:'This Iveco passenger version, 7 seats, displacement 2.5L, overall dimensions 4875×2000×2570 mm, 8AT automatic transmission, FOB price 19900 US dollars',fr:'Cette version passagers Iveco, 7 places, cylindrée 2,5 L, dimensions totales 4875×2000×2570 mm, boîte automatique 8 rapports, prix FOB 19900 dollars américains',ar:'هذه نسخة ركاب ايفيكو، 7 مقاعد، سعة المحرك 2.5 لتر، الأبعاد الكلية 4875×2000×2570 ملم، ناقل حركة أوتوماتيكي 8 سرعات، سعر فوب 19900 دولار أمريكي'},
  {code:'790',name:'3100先生，这款沙克曼 X7 4×2 自卸车， CFR 价格。28200 美元。',en:'',fr:'Monsieur, ce camion benne SHACMAN X7 4×2, prix CFR 28200 dollars.',ar:'يا سيدي، هذه الشاحنة القلابة شاكمان X7 4×2، سعر CFR هو 28,200 دولار.'},
  {code:'793',name:'3101先生，这款沙克曼 F2000 6×4 自卸车，290 马力潍柴发动机，货箱长 5.2 米，货箱16立方， CFR 价格 47600 美元。',en:'Sir, this SHACMAN F2000 6×4 tipper truck, 290hp Weichai engine, cargo box length 5.2m, 16m³ box, CFR price $47,600.',fr:'Monsieur, ce camion benne SHACMAN F2000 6×4, moteur Weichai 290 ch, longueur de caisse 5,2 m, caisse de 16 m³, prix CFR 47600 dollars.',ar:'يا سيدي، هذه الشاحنة القلابة شاكمان F2000 6×4، محرك ويتشاي 290 حصان، طول الصندوق 5.2 متر، سعة 16 متر مكعب، سعر CFR هو 47,600 دولار.'},
  {code:'796',name:'3102先生，这款沙克曼 F3000 6×4 自卸车，340 马力，潍柴发动机，货箱长 5.2 米。货箱16立方， CFR 价格 49500 美元。',en:'Sir, this SHACMAN F3000 6×4 tipper truck, 340hp, Weichai engine, cargo box length 5.2m, 16m³ box, CFR price $49,500.',fr:'Monsieur, ce camion benne SHACMAN F3000 6×4, 340 ch, moteur Weichai, longueur de caisse 5,2 m, caisse de 16 m³, prix CFR 49 500 dollars.',ar:'يا سيدي، هذه الشاحنة القلابة شاكمان F3000 6×4، 340 حصان، محرك ويتشاي، طول الصندوق 5.2 متر، سعة 16 متر مكعب، سعر CFR هو 49,500 دولار.'},
  {code:'799',name:'3103先生，这款沙克曼 F3000 8×4 自卸车，380 马力，潍柴发动机，货箱长 6.5 米。 CFR 价格 58300美元。',en:'Sir, this SHACMAN F3000 8×4 tipper truck, 380hp, Weichai engine, cargo box length 6.5m, CFR price $58,300.',fr:'Monsieur, ce camion benne SHACMAN F3000 8×4, 380 ch, moteur Weichai, longueur de caisse 6,5 m, prix CFR 58 300 dollars.',ar:'يا سيدي، هذه الشاحنة القلابة شاكمان F3000 8×4، 380 حصان، محرك ويتشاي، طول الصندوق 6.5 متر، سعر CFR هو 58,300 دولار.'},
  {code:'802',name:'3104先生，这款沙克曼 X9 4×2 载货车，货箱长 4.1 米 CFR 价格 21700 美元。',en:'Sir, this SHACMAN X9 4×2 cargo truck, cargo box length 4.1m, CFR price $21,700.',fr:'Monsieur, ce camion de fret SHACMAN X9 4×2, longueur de caisse 4,1 m, prix CFR 21 700 dollars.',ar:'يا سيدي، شاحنة بضائع شاكمان X9 4×2، طول الصندوق 4.1 متر، سعر CFR هو 21,700 دولار.'},
  {code:'805',name:'3105先生，这款沙克曼 L3000 4×2 载货车底盘，210 马力，潍柴发动机， CFR 价格 31300 美元。',en:'Sir, this SHACMAN L3000 4×2 cargo truck chassis, 210hp, Weichai engine, CFR price $31,300.',fr:'Monsieur, ce châssis de camion de fret SHACMAN L3000 4×2, 210 ch, moteur Weichai, prix CFR 31 300 dollars.',ar:'يا سيدي، هيكل شاحنة بضائع شاكمان L3000 4×2، 210 حصان، محرك ويتشاي، سعر CFR هو 31,300 دولار.'},
  {code:'808',name:'3106先生，这款沙克曼 L3000 4×2 载货车，210 马力、潍柴发动机，货箱长 6.8 米 CFR 价格 33900 美元',en:'Sir, this SHACMAN L3000 4×2 cargo truck, 210hp, Weichai engine, cargo box length 6.8m, CFR price $33,900.',fr:'Monsieur, ce camion de fret SHACMAN L3000 4×2, 210 ch, moteur Weichai, longueur de caisse 6,8 m, prix CFR 33 900 dollars.',ar:'يا سيدي، شاحنة بضائع شاكمان L3000 4×2، 210 حصان، محرك ويتشاي، طول الصندوق 6.8 متر، سعر CFR هو 33,900 دولار.'},
  {code:'811',name:'3107先生，这款沙克曼 L3000 4×2 高栏载货车，210 马力，潍柴发动机。货箱长 6.8 米， CFR 价格 35600 美元。',en:'Sir, this SHACMAN L3000 4×2 stake cargo truck, 210hp, Weichai engine, cargo box length 6.8m, CFR price $35,600.',fr:'Monsieur, ce camion à ridelles hautes SHACMAN L3000 4×2, 210 ch, moteur Weichai, longueur de caisse 6,8 m, prix CFR 35 600 dollars.',ar:'يا سيدي، شاحنة بضائع بسياج عالي شاكمان L3000 4×2، 210 حصان، محرك ويتشاي، طول الصندوق 6.8 متر، سعر CFR هو 35,600 دولار.'},
  {code:'814',name:'3108先生，这款沙克曼 L3000 4×2 载货底盘，210 马力，潍柴发动机。 CFR 价格 34900 美元。',en:'Sir, this SHACMAN L3000 4×2 cargo chassis, 210hp, Weichai engine, CFR price $34,900.',fr:'Monsieur, ce châssis de fret SHACMAN L3000 4×2, 210 ch, moteur Weichai, prix CFR 34 900 dollars.',ar:'يا سيدي، هيكل شحن شاكمان L3000 4×2، 210 حصان، محرك ويتشاي، سعر CFR هو 34,900 دولار.'},
  {code:'817',name:'3109先生，这款沙克曼 L3000 4×2 载货车，210 马力、潍柴发动机，货箱长 7.75 米。 CFR 价格 36800 美元。',en:'Sir, this SHACMAN L3000 4×2 cargo truck, 210hp, Weichai engine, cargo box length 7.75m, CFR price $36,800.',fr:'Monsieur, ce camion de fret SHACMAN L3000 4×2, 210 ch, moteur Weichai, longueur de caisse 7,75 m, prix CFR 36 800 dollars.',ar:'يا سيدي، شاحنة بضائع شاكمان L3000 4×2، 210 حصان، محرك ويتشاي، طول الصندوق 7.75 متر، سعر CFR هو 36,800 دولار.'},
  {code:'820',name:'3110先生，这一款沙克曼 L3000 4×2 厢式货车，210 马力、潍柴发动机，货箱长 6.7 米。 CFR 价格 38300 美元。',en:'Sir, this SHACMAN L3000 4×2 van truck, 210hp, Weichai engine, cargo box length 6.7m, CFR price $38,300.',fr:'Monsieur, ce camion fourgon SHACMAN L3000 4×2, 210 ch, moteur Weichai, longueur de caisse 6,7 m, prix CFR 38 300 dollars.',ar:'يا سيدي، شاحنة فان شاكمان L3000 4×2، 210 حصان، محرك ويتشاي، طول الصندوق 6.7 متر، سعر CFR هو 38,300 دولار.'},
  {code:'823',name:'3111先生，这款沙克曼 F3000 6×4 载货车，340 马力，潍柴发动机，货箱长 9.3 米。 CFR 价格 53900 美元',en:'Sir, this SHACMAN F3000 6×4 cargo truck, 340hp, Weichai engine, cargo box length 9.3m, CFR price $53,900.',fr:'Monsieur, ce camion de fret SHACMAN F3000 6×4, 340 ch, moteur Weichai, longueur de caisse 9,3 m, prix CFR 53 900 dollars.',ar:'يا سيدي، شاحنة بضائع شاكمان F3000 6×4، 340 حصان، محرك ويتشاي، طول الصندوق 9.3 متر، سعر CFR هو 53,900 دولار.'},
  {code:'826',name:'3112先生，这款沙克曼 F3000 6×4 厢式载货车，340 马力，潍柴发动机。货箱长 9.3 米。 CFR 价格 55800 美元。',en:'Sir, this SHACMAN F3000 6×4 van truck, 340hp, Weichai engine, cargo box length 9.3m, CFR price $55,800.',fr:'Monsieur, ce camion fourgon SHACMAN F3000 6×4, 340 ch, moteur Weichai, longueur de caisse 9,3 m, prix CFR 55 800 dollars.',ar:'يا سيدي، شاحنة بضائع صندوقية شاكمان F3000 6×4، 340 حصان، محرك ويتشاي، طول الصندوق 9.3 متر، سعر CFR هو 55,800 دولار.'},
  {code:'829',name:'3113先生，这款沙克曼 F2000 6×4 水罐车，290马力潍柴发动机。罐体20方,CFR 价格 48800 美元',en:'Sir, this SHACMAN F2000 6×4 water tanker, 290hp Weichai engine, 20m³ tank, CFR price $48,800.',fr:'Monsieur, ce camion-citerne à eau SHACMAN F2000 6×4, moteur Weichai 290 ch, citerne de 20 m³, prix CFR 48 800 dollars.',ar:'يا سيدي، صهريج مياه شاكمان F2000 6×4، محرك ويتشاي 290 حصان، خزان 20 متر مكعب، سعر CFR هو 48,800 دولار.'},
  {code:'832',name:'3114先生，这一款沙克曼 L3000 4×2 油罐车，210 马力、潍柴发动机。罐体 8 方 CFR 价格 38700 美元',en:'Sir, this SHACMAN L3000 4×2 fuel tanker, 210hp, Weichai engine, 8m³ tank, CFR price $38,700.',fr:'Monsieur, ce camion-citerne à carburant SHACMAN L3000 4×2, 210 ch, moteur Weichai, citerne de 8 m³, prix CFR 38 700 dollars.',ar:'يا سيدي، صهريج وقود شاكمان L3000 4×2، 210 حصان، محرك ويتشاي، خزان 8 متر مكعب، سعر CFR هو 38,700 دولار.'},
  {code:'835',name:'3115先生，这款沙克曼 F2000 6×4 8 立方搅拌车，340 马力、潍柴发动机， CFR 价格 57300 美元。',en:'Sir, this SHACMAN F2000 6×4 8m³ concrete mixer truck, 340hp, Weichai engine, CFR price $57,300.',fr:'Monsieur, ce camion malaxeur SHACMAN F2000 6×4 8 m³, 340 ch, moteur Weichai, prix CFR 57 300 dollars.',ar:'يا سيدي، خلاطة خرسانة شاكمان F2000 6×4 سعة 8 متر مكعب، 340 حصان، محرك ويتشاي، سعر CFR هو 57,300 دولار.'},
  {code:'838',name:'3116先生，这款沙克曼 F3000 6×4 搅拌车，10 立方，340 马力、潍柴发动机， CFR 价格 58100 美元。',en:'Sir, this SHACMAN F3000 6×4 concrete mixer truck, 10m³, 340hp, Weichai engine, CFR price $58,100.',fr:'Monsieur, ce camion malaxeur SHACMAN F3000 6×4, 10 m³, 340 ch, moteur Weichai, prix CFR 58 100 dollars.',ar:'يا سيدي، خلاطة خرسانة شاكمان F3000 6×4، 10 متر مكعب، 340 حصان، محرك ويتشاي، سعر CFR هو 58,100 دولار.'},
  {code:'841',name:'3117先生，这款沙克曼 F3000 8×4 12 立方搅拌车，380 马力潍柴发动机， CFR 价格 66300 美元。',en:'Sir, this SHACMAN F3000 8×4 12m³ concrete mixer truck, 380hp Weichai engine, CFR price $66,300.',fr:'Monsieur, ce camion malaxeur SHACMAN F3000 8×4 12 m³, moteur Weichai 380 ch, prix CFR 66 300 dollars.',ar:'يا سيدي، خلاطة خرسانة شاكمان F3000 8×4 سعة 12 متر مكعب، محرك ويتشاي 380 حصان، سعر CFR هو 66,300 دولار.'},
  {code:'844',name:'3118先生，这一款沙克曼 L3000 4×2 6吨折臂吊，CFR 价格 49500 美元。',en:'Sir, this SHACMAN L3000 4×2 6-ton knuckle boom crane truck, CFR price $49,500.',fr:'Monsieur, ce camion grue à flèche articulée 6T SHACMAN L3000 4×2, prix CFR 49 500 dollars.',ar:'يا سيدي، شاحنة كرين شاكمان L3000 4×2 رافعة مفصلية 6 طن، سعر CFR هو 49,500 دولار.'},
  {code:'847',name:'3119先生，这款沙克曼 L3000 4×2 8 吨折臂吊，210 马力、潍柴发动机， CFR 价格 56400 美元。',en:'Sir, this SHACMAN L3000 4×2 8-ton knuckle boom crane truck, 210hp, Weichai engine, CFR price $56,400.',fr:'Monsieur, ce camion grue à flèche articulée 8T SHACMAN L3000 4×2, 210 ch, moteur Weichai, prix CFR 56 400 dollars.',ar:'يا سيدي، شاحنة كرين شاكمان L3000 4×2 رافعة مفصلية 8 طن، 210 حصان، محرك ويتشاي، سعر CFR هو 56,400 دولار.'},
  {code:'850',name:'3120先生，这款沙克曼 F3000 6×4 8 吨随车吊，340 马力、潍柴发动机。 CFR 价格 72300 美元。',en:'Sir, this SHACMAN F3000 6×4 8-ton truck-mounted crane, 340hp, Weichai engine, CFR price $72,300.',fr:'Monsieur, ce camion avec grue 8T SHACMAN F3000 6×4, 340 ch, moteur Weichai, prix CFR 72 300 dollars.',ar:'يا سيدي، شاحنة برافعة شاكمان F3000 6×4 سعة 8 طن، 340 حصان، محرك ويتشاي، سعر CFR هو 72,300 دولار.'},
  {code:'853',name:'3121先生，这款沙克曼 X3000 4×2牵引车 430马力潍柴发动机， CFR 价格 51000 美元',en:'Sir, this SHACMAN X3000 4×2 tractor unit, 430hp Weichai engine, CFR price $51,000.',fr:'Monsieur, ce tracteur routier SHACMAN X3000 4×2, moteur Weichai 430 ch, prix CFR 51 000 dollars.',ar:'يا سيدي، رأس تريلا شاكمان X3000 4×2، محرك ويتشاي 430 حصان، سعر CFR هو 51,000 دولار.'},
  {code:'856',name:'3122先生，这款沙克曼 X3000 6×4 牵引车，430 马力， CFR 价格 54300 美元。',en:'Sir, this SHACMAN X3000 6×4 tractor unit, 430hp, CFR price $54,300.',fr:'Monsieur, ce tracteur routier SHACMAN X3000 6×4, 430 ch, prix CFR 54 300 dollars.',ar:'يا سيدي، رأس تريلا شاكمان X3000 6×4، 430 حصان، سعر CFR هو 54,300 دولار.'},
  {code:'859',name:'3123先生，这款沙克曼 F3000 4×2 垃圾车，货箱 12 立方， CFR 价格 57900 美元。',en:'Sir, this SHACMAN F3000 4×2 garbage truck, 12m³ box, CFR price $57,900.',fr:'Monsieur, ce camion poubelle SHACMAN F3000 4×2, caisse 12 m³, prix CFR 57 900 dollars.',ar:'يا سيدي، شاحنة نفايات شاكمان F3000 4×2، صندوق 12 متر مكعب، سعر CFR هو 57,900 دولار.'},
  {code:'862',name:'3124先生，这款沙克曼 F3000 6×4 饲料运输车。罐体 30 个立方， CFR 价格 61300 美元。',en:'Sir, this SHACMAN F3000 6×4 feed transport truck, 30m³ tank, CFR price $61,300.',fr:'Monsieur, ce camion de transport d\'aliments SHACMAN F3000 6×4, citerne 30 m³, prix CFR 61 300 dollars.',ar:'يا سيدي، شاحنة نقل أعلاف شاكمان F3000 6×4، خزان 30 متر مكعب، سعر CFR هو 61,300 دولار.'},
  {code:'865',name:'3125先生，这款沙克曼 L3000 4×2 吸污车，罐体 12 个立方，210 马力潍柴发动机， CFR 价格 47800 美元。',en:'Sir, this SHACMAN L3000 4×2 sewage suction truck, 12m³ tank, 210hp Weichai engine, CFR price $47,800.',fr:'Monsieur, ce camion hydrocureur SHACMAN L3000 4×2, citerne 12 m³, moteur Weichai 210 ch, prix CFR 47 800 dollars.',ar:'يا سيدي، شاحنة شفط مجاري شاكمان L3000 4×2، خزان 12 متر مكعب، محرك ويتشاي 210 حصان، سعر CFR هو 47,800 دولار.'},
  {code:'868',name:'3126先生，这款沙克曼 L3000 4×2 吸污车，罐体 10 立方，210 马力潍柴发动机， CFR 价格 42600 美元。',en:'Sir, this SHACMAN L3000 4×2 sewage suction truck, 10m³ tank, 210hp Weichai engine, CFR price $42,600.',fr:'Monsieur, ce camion hydrocureur SHACMAN L3000 4×2, citerne 10 m³, moteur Weichai 210 ch, prix CFR 42 600 dollars.',ar:'يا سيدي، شاحنة شفط مجاري شاكمان L3000 4×2، خزان 10 متر مكعب، محرك ويتشاي 210 حصان، سعر CFR هو 42,600 دولار.'},
  {code:'871',name:'汕德卡4x2牵引车平顶版的长宽高是6378mm*2550mm*3290mm，自重8吨，大概54个立方。',en:'汕德卡4x2牵引车平顶版的长宽高是6378mm*2550mm*3290mm，自重8吨，大概54个立方。',fr:'',ar:''},
  {code:'872',name:'汕德卡6x4牵引车平顶版的长宽高是7175mm*2525mm*3300mm，自重9吨，大概60个立方。',en:'汕德卡6x4牵引车平顶版的长宽高是7175mm*2525mm*3300mm，自重9吨，大概60个立方。',fr:'',ar:''},
  {code:'873',name:'豪沃tx6x4自卸车340马力16立方整车尺寸是8480mm*2590mm*3450mm，自重13吨，大概78个立方。',en:'豪沃tx6x4自卸车340马力16立方整车尺寸是8480mm*2590mm*3450mm，自重13吨，大概77个立方。',fr:'',ar:''},
  {code:'874',name:'豪沃tx6x4自卸车380马力18立方整车尺寸是8480mm*2590mm*3570mm，自重13吨，大概79个立方。',en:'豪沃tx6x4自卸车380马力18立方整车尺寸是8480mm*2590mm*3570mm，自重13吨，大概79个立方。',fr:'',ar:''},
  {code:'875',name:'豪沃tx8x4自卸车400马力22立方整车尺寸是9950mm*2625mm*3460mm，自重13吨，大概95个立方。',en:'豪沃tx8x4自卸车400马力22立方整车尺寸是9950mm*2625mm*3460mm，自重13吨，大概95个立方。',fr:'',ar:''},
  {code:'876',name:'豪沃tx自卸车6x4货箱价格53000元人民币',en:'豪沃tx自卸车6x4货箱价格53000元人民币',fr:'',ar:''},
  {code:'877',name:'豪沃tx自卸车8x4货箱价格61000元人民币',en:'豪沃tx自卸车8x4货箱价格61000元人民币',fr:'',ar:''},
  {code:'878',name:'阿尔及利亚海运费牵引车和自卸车每立方按照98每立方计算，轻卡按照105每立方计算。',en:'阿尔及利亚海运费牵引车和自卸车每立方按照98每立方计算，轻卡按照105每立方计算。',fr:'',ar:''},
  {code:'879',name:'豪沃tx8x4自卸车改颜色，需要1万人民币',en:'豪沃tx8x4自卸车改颜色，需要1万人民币',fr:'',ar:''},
  {code:'880',name:'泵车有37米，43米，52米，62米，69米的',en:'泵车有37米，43米，52米，62米，69米的',fr:'',ar:''},
  {code:'881',name:'4×2 2600轴距，单排货箱 3.3m，排半 2.8m，双排 2.3m，整车长 5m',en:'4×2 2600轴距，单排货箱 3.3m，排半 2.8m，双排 2.3m，整车长 5m',fr:'',ar:''},
  {code:'882',name:'4×2 2800轴距，单排 3.8m，排半 3.3m，双排 2.8m，整车长 5.5m',en:'4×2 2800轴距，单排 3.8m，排半 3.3m，双排 2.8m，整车长 5.5m',fr:'',ar:''},
  {code:'883',name:'4×2 3000轴距，单排 4.0m，排半 3.5m，双排 3.0m，整车长 5.7m',en:'4×2 3000轴距，单排 4.0m，排半 3.5m，双排 3.0m，整车长 5.7m',fr:'',ar:''},
  {code:'884',name:'4×2 3360轴距，单排 4.2m，排半 3.8m，双排 3.3m，整车长 6.0m',en:'4×2 3360轴距，单排 4.2m，排半 3.8m，双排 3.3m，整车长 6.0m',fr:'',ar:''},
  {code:'885',name:'4×2 3600轴距，单排 4.8m，排半 4.3m，无双排，整车长 6.5m',en:'4×2 3600轴距，单排 4.8m，排半 4.3m，无双排，整车长 6.5m',fr:'',ar:''},
  {code:'886',name:'4×2 3800轴距，单排 5.2m，排半 4.8m，无双排，整车长 7.0m',en:'4×2 3800轴距，单排 5.2m，排半 4.8m，无双排，整车长 7.0m',fr:'',ar:''},
  {code:'887',name:'4×2 4200轴距，单排 5.8m，排半 5.3m，无双排，整车长 7.5m',en:'4×2 4200轴距，单排 5.8m，排半 5.3m，无双排，整车长 7.5m',fr:'',ar:''},
  {code:'888',name:'4×2 4500轴距，单排 6.2m，排半 5.8m，无双排，整车长 8.0m',en:'4×2 4500轴距，单排 6.2m，排半 5.8m，无双排，整车长 8.0m',fr:'',ar:''},
  {code:'889',name:'4×2 4700轴距，无单排，排半 6.2m，无双排，整车长 8.5m',en:'4×2 4700轴距，无单排，排半 6.2m，无双排，整车长 8.5m',fr:'',ar:''},
  {code:'890',name:'4×2 5000–5300轴距，单排 7.0m，排半 6.8m，无双排，整车长 9.0m',en:'4×2 5000–5300轴距，单排 7.0m，排半 6.8m，无双排，整车长 9.0m',fr:'',ar:''},
  {code:'891',name:'4×2 5800轴距，无单排，排半 7.7m，无双排，整车长 10.0m',en:'4×2 5800轴距，无单排，排半 7.7m，无双排，整车长 10.0m',fr:'',ar:''},
  {code:'892',name:'4×2 大单桥轴距 7000–7300轴距，排半货箱 9.6m，整车长 12.0m',en:'4×2 大单桥轴距 7000–7300轴距，排半货箱 9.6m，整车长 12.0m',fr:'',ar:''},
  {code:'893',name:'6×4 小三轴（前四后四）轴距 1900+4700轴距，排半货箱 8.8m，整车长 11.0m',en:'6×4 小三轴（前四后四）轴距 1900+4700轴距，排半货箱 8.8m，整车长 11.0m',fr:'',ar:''},
  {code:'894',name:'6×4 前四后四轴距 1900+5600轴距，排半货箱 9.6m，整车长 12.0m',en:'6×4 前四后四轴距 1900+5600轴距，排半货箱 9.6m，整车长 12.0m',fr:'',ar:''},
  {code:'895',name:'6×4 后八轮轴距 5800+1350轴距，排半货箱 9.6m，整车长 12.0m',en:'6×4 后八轮轴距 5800+1350轴距，排半货箱 9.6m，整车长 12.0m',fr:'',ar:''},
  {code:'896',name:'8×4 前四后八轴距 2000+4500+1350轴距，排半货箱 9.6m，整车长 12.0m',en:'8×4 前四后八轴距 2000+4500+1350轴距，排半货箱 9.6m，整车长 12.0m',fr:'',ar:''},
  {code:'897',name:'高空作业车，最低高度18米，最高30米，适用在4x2或者6x4载货车上，承载200公斤，瑞雅特上装价格12.5元含税',en:'高空作业车，最低高度18米，最高30米，适用在4x2或者6x4载货车上，承载200公斤，瑞雅特上装价格12.5元含税',fr:'',ar:''},
  {code:'898',name:'瑞雅特上装高空作业车可以制作高80米-90米，但需要8x4的底盘，上装价格根据高度单独问',en:'瑞雅特上装高空作业车可以制作高80米-90米，但需要8x4的底盘，上装价格根据高度单独问',fr:'',ar:''},
  {code:'899',name:'33轴距轻卡做清障车，瑞雅特一托二上装4万人民币含税',en:'33轴距轻卡做清障车，瑞雅特一托二上装4万人民币含税',fr:'',ar:''},
  {code:'900',name:'33轴距轻卡做压缩式垃圾车，程力上装5.5万人民币含税，山东岳强报价6.5万',en:'33轴距轻卡做压缩式垃圾车，程力上装5.5万人民币含税，山东岳强报价6.5万',fr:'',ar:''},
  {code:'901',name:'33轴距洗扫式垃圾车，山东岳强上装价格12万',en:'33轴距洗扫式垃圾车，山东岳强上装价格12万',fr:'',ar:''},
  {code:'902',name:'冷藏车上装价格每米7000元x货箱长度等于货箱价格。货箱内部通风槽4000元，顶部导轨5000元。',en:'冷藏车上装价格每米7000元x货箱长度等于货箱价格。货箱内部通风槽4000元，顶部导轨5000元。',fr:'',ar:''},
];

// =================== INIT ===================
var currentPhone = '',loginTime=null;

// === 活动追踪 ===
function trackActivity(action,detail){
  var now=new Date().toISOString(),date=now.slice(0,10);
  var phone=currentUser?currentUser.phone:'';
  chrome.storage.local.get(['daily_activity'],function(d){
    var act=d.daily_activity||{};
    if(!act[date])act[date]={firstActivity:now,lastActivity:now,pluginClicks:0,translations:0,saves:0,replies:0,events:[]};
    act[date].lastActivity=now;
    if(!act[date].firstPlugin||now<act[date].firstPlugin)act[date].firstPlugin=now;
    act[date].lastPlugin=now;
    act[date].pluginClicks=(act[date].pluginClicks||0)+1;
    if(action==='save')act[date].saves=(act[date].saves||0)+1;
    if(action==='translate')act[date].translations=(act[date].translations||0)+1;
    if(action==='reply')act[date].replies=(act[date].replies||0)+1;
    act[date].events.push({t:now,a:action,d:detail||'',u:phone});
    act[date].events=act[date].events.slice(-200);
    chrome.storage.local.set({daily_activity:act});
    // Also save to localStorage for CRM backend access
    try{localStorage.setItem('crm_daily_'+date,JSON.stringify(act[date]));}catch(e){}
  });
}
var msgCount=0,clickCount=0,timerInterval=null;

// ===== 监听翻译复制请求，生成图片复制到剪贴板 =====
chrome.runtime.onMessage.addListener(function(req,sender,sendResponse){
  if(req.type==='CRM_COPY_IMAGE'&&req.text){
    var canvas=document.createElement('canvas');
    var ctx=canvas.getContext('2d');
    ctx.font='14px -apple-system,BlinkMacSystemFont,sans-serif';
    var w=ctx.measureText(req.text).width+32;
    canvas.width=Math.max(w,200);canvas.height=30;
    ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle='#333';ctx.font='14px -apple-system,BlinkMacSystemFont,sans-serif';
    ctx.textAlign='left';
    ctx.fillText(req.text,12,20);
    canvas.toBlob(function(blob){
      navigator.clipboard.write([new ClipboardItem({'image/png':blob})]).then(function(){
        console.log('[CRM] Image copied');
      }).catch(function(e){
        console.log('[CRM] Clipboard failed, fallback text');
        // fallback notification handled by the injected div
      });
    });
  }
});

// =================== ATTENDANCE: Init ===================
function initAttendance(){
  chrome.storage.local.get(['current_user','attendance'],function(d){
    currentUser=d.current_user;
    if(!currentUser||!currentUser.id){return;}
    loginTime=new Date(currentUser.loginTime);
    var bar=document.getElementById('attBar');
    bar.style.display='flex';
    document.getElementById('attUser').textContent='👤 '+currentUser.name;

    // Check weekend
    var now=new Date(),day=now.getDay();
    if(day===0||day===6){bar.classList.add('weekend');document.getElementById('attClock').textContent='🕐 '+now.toLocaleTimeString('zh-CN')+' (周末)';}
    else document.getElementById('attClock').textContent='🕐 '+now.toLocaleTimeString('zh-CN');

    // Restore today's counts
    var today=now.toISOString().slice(0,10);
    var att=d.attendance||{},todayAtt=(att[today]||{})[currentUser.id];
    if(todayAtt){msgCount=todayAtt.messages||0;clickCount=todayAtt.clicks||0;}
    document.getElementById('attMsgs').textContent='💬 '+msgCount+' · 👆 '+clickCount;

    // Start timer
    updateTimer();
    timerInterval=setInterval(updateTimer,30000);
    // Global click counter
    document.addEventListener('click',function(){clickCount++;saveAttendance();});
  });
}

function updateTimer(){
  if(!loginTime)return;
  var diff=Math.floor((new Date()-loginTime)/1000);
  var h=Math.floor(diff/3600),m=Math.floor((diff%3600)/60);
  document.getElementById('attDuration').textContent='⏱ '+h+'h '+m+'m';
  saveAttendance();
}

function saveAttendance(){
  if(!currentUser||!currentUser.id)return;
  var today=new Date().toISOString().slice(0,10);
  chrome.storage.local.get(['attendance'],function(d){
    var att=d.attendance||{};
    if(!att[today])att[today]={};
    if(!att[today][currentUser.id])att[today][currentUser.id]={login:currentUser.loginTime};
    att[today][currentUser.id].messages=msgCount;
    att[today][currentUser.id].clicks=clickCount;
    chrome.storage.local.set({attendance:att});
  });
}

// Logout
document.getElementById('btnLogout').onclick=function(){
  if(!currentUser)return;
  if(timerInterval)clearInterval(timerInterval);
  var today=new Date().toISOString().slice(0,10);
  chrome.storage.local.get(['attendance'],function(d){
    var att=d.attendance||{};
    if(!att[today])att[today]={};
    if(!att[today][currentUser.id])att[today][currentUser.id]={};
    att[today][currentUser.id].logout=new Date().toISOString();
    chrome.storage.local.set({attendance:att,current_user:null},function(){
      document.getElementById('attBar').style.display='none';
      showStatus(status,'👋 已下班，数据已保存',true);
    });
  });
};

// =================== FILE UPLOAD ===================


document.getElementById('ordersContainer').addEventListener('click',function(e){
  // File upload (PI/合同/交单)
  if(e.target.classList.contains('upload-btn')){
    var num=e.target.getAttribute('data-order');
    var type=e.target.getAttribute('data-type');
    var prefix='o'+num+'_';
    var typeNames={pi:'PI',contract:'客户合同',pur_contract:'采购合同',freight_contract:'货代合同',delivery:'交单'};
    var fileInput=document.getElementById(prefix+type+'_file');
    if(!fileInput){return;}
    console.log('[CRM] upload clicked:',type,num,'file:',!!fileInput.files[0]);
    var file=fileInput.files[0];
    if(!file){alert('请先选择文件');return;}
    if(!currentPhone){alert('请先获取客户信息');return;}
    // 用FileReader读取文件
    var fr=new FileReader();
    fr.onerror=function(){console.log('[CRM] FileReader ERROR');};
    fr.onabort=function(){console.log('[CRM] FileReader ABORTED');};
    fr.onloadend=function(){
      console.log('[CRM] FileReader DONE, result:',fr.result?fr.result.length:'null',', error:',fr.error);
      if(!fr.result||fr.error){alert('文件读取失败');return;}
      chrome.storage.local.get(['doc_records'],function(d){
        var records=d.doc_records||{};
        var key=currentPhone+'_order'+num+'_'+type;
        if(!records[key])records[key]=[];
        records[key].push({
          fileName:file.name,size:file.size,type:type,
          uploadedAt:new Date().toISOString(),data:fr.result
        });
        chrome.storage.local.set({doc_records:records},function(){
          console.log('[CRM] storage.set done');
          fileInput.value='';
          if(type==='pi')updatePICount();
          showFilesList(currentPhone,num,type);
          showStatus(status,'📎 '+typeNames[type]+'已上传: '+file.name,true);
        });
      });
    };
    console.log('[CRM] starting readAsDataURL...');
    try{fr.readAsDataURL(file);console.log('[CRM] readAsDataURL called');}
    catch(ex){console.log('[CRM] readAsDataURL error:',ex);}
  }
  // Order delete button
  if(e.target.classList.contains('order-remove')){
    var num=parseInt(e.target.getAttribute('data-order'));
    removeOrder(num);
  }
  // 已成单 checkbox
  if(e.target.type==='checkbox'&&e.target.id.indexOf('_confirmed')>0){
    var onum=e.target.getAttribute('data-order');
    var detail=document.getElementById('o'+onum+'_detail');
    if(detail)detail.style.display=e.target.checked?'block':'none';
  }
});

document.getElementById('searchResults').addEventListener('click',function(e){
  var item=e.target.closest('.search-result-item');
  if(item)openCustomer(item.getAttribute('data-phone'));
});

function updatePICount(){
  chrome.storage.local.get(['pi_records'],function(d){
    var records=d.pi_records||{},total=0,month=new Date().toISOString().slice(0,7);
    Object.keys(records).forEach(function(phone){
      (records[phone]||[]).forEach(function(r){if(r.uploadedAt&&r.uploadedAt.slice(0,7)===month)total++;});
    });
    var el=document.getElementById('piCount');
    if(!el)return;
    el.textContent='(本月: '+total+'/60)';
    if(total>=60)el.style.color='#059669';
    else el.style.color='#94a3b8';
  });
}

// Increment message count from content script
function incMsgCount(){
  msgCount++;
  document.getElementById('attMsgs').textContent='💬 '+msgCount+' · 👆 '+clickCount;
  saveAttendance();
}

// Init data
var PRODUCTS_API = 'http://47.96.255.110/api/products';
// Apply server config: update CATEGORIES_BY_BRAND + DRIVES from API
function applyConfig(cfg){
  if(!cfg)return;
  if(cfg.categories_by_brand){CATEGORIES_BY_BRAND=cfg.categories_by_brand;}
  if(cfg.drives){DRIVES=cfg.drives;}
  console.log('[CRM] Config applied, brands:',Object.keys(CATEGORIES_BY_BRAND).join(','));
}
function syncProducts(callback){
  fetch(PRODUCTS_API)
    .then(function(r){return r.json();})
    .then(function(data){
      applyConfig(data.config);
      var prods=data.products||{};
      if(Object.keys(prods).length>0){
        chrome.storage.local.set({products:prods});
      }
      if(callback)callback(prods);
    })
    .catch(function(){if(callback)callback(null);});
}
chrome.storage.local.get(['products','replies'],function(d){
  if(!d.replies||!d.replies.length) chrome.storage.local.set({replies:DEFAULT_REPLIES});
  if(d.replies&&Array.isArray(d.replies)&&!d.replies.length){chrome.storage.local.set({replies:DEFAULT_REPLIES});repliesData=DEFAULT_REPLIES;}
  repliesData=(d.replies&&d.replies.length)?d.replies:DEFAULT_REPLIES;
  // Always start fresh
  prodsData=DEFAULT_PRODUCTS;
  // Fetch server products and merge NOW
  console.log('[CRM] 开始获取服务器产品...');
  fetch(PRODUCTS_API).then(function(r){return r.json();}).then(function(data){
    applyConfig(data.config);
    var sp=data.products;
    console.log('[CRM] 服务器产品返回:',sp?Object.keys(sp).filter(function(k){return k!=='undefined';}).join(', '):'空');
    if(sp&&Object.keys(sp).length){
      var added=0;
      Object.keys(sp).forEach(function(ct){
        if(ct==='undefined')return;
        if(!prodsData[ct]){prodsData[ct]={};added++;}
        Object.keys(sp[ct]).forEach(function(bn){
          if(!prodsData[ct][bn])prodsData[ct][bn]={};
          Object.keys(sp[ct][bn]).forEach(function(cn){
            if(!prodsData[ct][bn][cn])prodsData[ct][bn][cn]={};
            Object.keys(sp[ct][bn][cn]).forEach(function(dn){
              if(!prodsData[ct][bn][cn][dn])prodsData[ct][bn][cn][dn]=[];
              var existing=prodsData[ct][bn][cn][dn];
              sp[ct][bn][cn][dn].forEach(function(p){
                var key=(p.name||p.model||'');
                if(!existing.some(function(e){return(e.name||e.model||'')===key;})){existing.push(p);}
              });
            });
          });
        });
      });
      console.log('[CRM] 合并完成, 新增国家:',added,', 总国家:',Object.keys(prodsData).length);
    }
  }).catch(function(e){console.log('[CRM] 获取服务器产品失败:',e);});
});

// ===== 今日总结 =====
function updateDailySummary(){
  var today=new Date().toISOString().slice(0,10);
  chrome.storage.local.get(['customers'],function(d){
    var cust=d.customers||{};
    // 统计今日新增客户 + 回访
    var newCustomers=0,followups=0;
    Object.keys(cust).forEach(function(ph){
      var c=cust[ph];
      if(c.firstSeen&&c.firstSeen.slice(0,10)===today)newCustomers++;
      if(c.nextFollowUp&&c.nextFollowUp.slice(0,10)===today)followups++;
    });
    // 统计PI
    chrome.storage.local.get(['doc_records'],function(dr){
      var records=dr.doc_records||{};
      var piCount=0;
      Object.keys(records).forEach(function(key){
        var arr=records[key]||[];
        arr.forEach(function(r){
          if(r.uploadedAt&&r.uploadedAt.slice(0,10)===today)piCount++;
        });
      });
      document.getElementById('dsNew').textContent=newCustomers+' 人';
      document.getElementById('dsPI').textContent=piCount+' 份';
      // 追踪数据 + 回访统计
      chrome.storage.local.get(['daily_activity'],function(d2){
        var act=(d2.daily_activity||{})[today]||{},sentTo=act.sentTo||[];
        // 统计已回访数
        var done=0;
        Object.keys(cust).forEach(function(ph){
          var c=cust[ph];
          if(c.nextFollowUp&&new Date(c.nextFollowUp)<=new Date(today)){
            var clean=ph.replace(/[^\d]/g,'');
            if(sentTo.indexOf(clean)>=0)done++;
          }
        });
        document.getElementById('dsFollow').textContent=followups;
        document.getElementById('dsFollowDone').textContent=done;
        document.getElementById('dsFollowLeft').textContent=followups-done;
        document.getElementById('dsReply').textContent=(act.replyCount||0)+' 条';
        document.getElementById('dsTrans').textContent=(act.translations||0)+' 次';
        if(act.firstActivity){
          document.getElementById('dsFirst').textContent=new Date(act.firstActivity).toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'});
          document.getElementById('dsLast').textContent=new Date(act.lastActivity).toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'});
        }
      });
    });
  });
  // 管理员看团队数据
  if(isAdmin()&&document.getElementById('teamSummary')){
    var ts=document.getElementById('teamSummary');
    ts.style.display='block';
    ts.innerHTML='<div style="font-weight:600;margin-bottom:4px">👥 团队客户</div>统计中...';
    setTimeout(function(){
      var controller = new AbortController();
      var timer = setTimeout(function(){ controller.abort(); }, 15000);
      fetch(CRM_API, { signal: controller.signal })
        .then(function(r){ clearTimeout(timer); return r.json(); })
        .then(function(d){
        var all=d.contacts||[];var cnt=all.length;
        var team={'王小涵':0,'毛振威':0,'杜飞跃':0,'赵欢乐':0};
        for(var i=0;i<all.length;i++){
          var c=all[i],n=(c.notes||'')+(c.owner||'');
          if(n.indexOf('王小涵')>=0)team['王小涵']++;
          else if(n.indexOf('毛震威')>=0||n.indexOf('毛振威')>=0)team['毛振威']++;
          else if(n.indexOf('杜飞跃')>=0||n.indexOf('杜飞月')>=0)team['杜飞跃']++;
          else if(n.indexOf('赵欢乐')>=0)team['赵欢乐']++;
        }
        var h='<div style="font-weight:600;margin-bottom:4px">👥 团队客户 (共'+cnt+'人)</div>';
        Object.keys(team).forEach(function(k){h+=k+': '+team[k]+'人<br>';});
        ts.innerHTML=h;
      }).catch(function(){
        ts.innerHTML='❌ 加载超时（服务器繁忙）';
        setTimeout(function(){ if(isAdmin()) updateDailySummary(); }, 30000);
      });
    },5000);
  }
  // 每小时刷新
  setTimeout(updateDailySummary,120000);  // 每2分钟刷新
}

// ===== 定期备份聊天记录和单据到服务器 =====
function backupToServer(){
  chrome.storage.local.get(null,function(all){
    var payload={
      phone: currentUser?currentUser.phone:'',
      customers: all.customers||{},
      chat_history: all.chat_history||{},
      doc_records: all.doc_records||{},
      replies: all.replies||{},
      products: all.products||{},
      attendance: all.attendance||{},
      daily_activity: all.daily_activity||{},
      contact_map: all.contact_map||{},
      action: 'backup'
    };
    fetch(CRM_API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
      .then(function(r){return r.json();})
      .then(function(){console.log('[CRM] 全部备份成功');})
      .catch(function(e){console.log('[CRM] 备份失败:',e);});
  });
}
// 每2小时备份一次，首次延迟5分钟
setTimeout(function(){backupToServer();setInterval(backupToServer,7200000);},300000);

// Init attendance + PI count + daily summary
trackActivity('open');
if(isLoggedIn)initAttendance();
// 延迟初始化今日总结
setTimeout(function(){updateDailySummary();},2000);
updatePICount();

// =================== NAV TABS ===================
document.querySelectorAll('.navtab').forEach(function(t){
  t.onclick=function(){
    document.querySelectorAll('.navtab').forEach(function(x){x.classList.remove('active');});
    this.classList.add('active');
    document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active');});
    document.getElementById('page-'+this.dataset.page).classList.add('active');
    if(this.dataset.page==='product') loadProductData();
    if(this.dataset.page==='quickreply') loadReplies();
    if(this.dataset.page==='tools') initTools();
  };
});

// =================== LANG TABS (quick reply) ===================
document.querySelectorAll('.langtab').forEach(function(t){
  t.onclick=function(){
    document.querySelectorAll('.langtab').forEach(function(x){x.classList.remove('active');});
    this.classList.add('active');
    currentLang=this.dataset.lang;
    renderReplies();
  };
});

// =================== CUSTOMER: Fetch ===================
var card=document.getElementById('card'),cname=document.getElementById('cname'),
    cphone=document.getElementById('cphone'),cmeta=document.getElementById('cmeta'),
    cstatus=document.getElementById('cstatus'),status=document.getElementById('status');

function showStatus(el,msg,ok){
  el.textContent=msg;el.className='status show '+(ok?'ok':'err');
  if(ok)setTimeout(function(){el.className='status';},3000);
}

// ========== 全局工具函数 ==========
function detectCountry(phone){
  var clean=(phone||'').replace(/[^\d]/g,'');
  var map={'213':'阿尔及利亚','249':'苏丹','234':'尼日利亚','86':'中国','44':'英国','968':'阿曼',
    '971':'阿联酋','966':'沙特','20':'埃及','212':'摩洛哥','216':'突尼斯',
    '218':'利比亚','225':'科特迪瓦','221':'塞内加尔','223':'马里','226':'布基纳法索',
    '227':'尼日尔','229':'贝宁','233':'加纳','237':'喀麦隆','241':'加蓬','242':'刚果',
    '243':'刚果金','254':'肯尼亚','255':'坦桑尼亚','256':'乌干达','257':'布隆迪','258':'莫桑比克',
    '260':'赞比亚','263':'津巴布韦','27':'南非',
    '7':'俄罗斯','1':'美国','33':'法国','49':'德国','39':'意大利','34':'西班牙',
    '31':'荷兰','32':'比利时','30':'希腊','41':'瑞士','43':'奥地利',
    '45':'丹麦','46':'瑞典','47':'挪威','48':'波兰',
    '52':'墨西哥','54':'阿根廷','55':'巴西','56':'智利','57':'哥伦比亚',
    '60':'马来西亚','61':'澳大利亚','62':'印尼','63':'菲律宾','64':'新西兰',
    '65':'新加坡','66':'泰国','81':'日本','82':'韩国','84':'越南',
    '852':'香港','855':'柬埔寨','880':'孟加拉','886':'台湾',
    '90':'土耳其','91':'印度','92':'巴基斯坦','93':'阿富汗','94':'斯里兰卡',
    '95':'缅甸','98':'伊朗'};
  for(var l=3;l>=1;l--){
    var p=clean.substring(0,l);
    if(map[p])return map[p];
  }
  return 'Unknown';
}

document.getElementById('btnFetch').onclick=async function(){
  var btn=this;
  btn.innerHTML='<span class="spin"></span>获取中...';btn.disabled=true;
  var safety=setTimeout(function(){btn.innerHTML='📥 获取当前客户';btn.disabled=false;},30000);
  try{
    var tabs=await chrome.tabs.query({url:'*://web.whatsapp.com/*'});
    console.log('[CRM] WhatsApp tabs:',tabs.length);
    if(!tabs[0]){showStatus(status,'请先打开 WhatsApp Web',false);return;}
    // 先激活WhatsApp标签页，确保WPP就绪
    await chrome.tabs.update(tabs[0].id,{active:true});
    await new Promise(function(r){setTimeout(r,3000);});  // 等3秒确保WPP完全加载

    var tr=await chrome.scripting.executeScript({target:{tabId:tabs[0].id},func:function(){
      // 读聊天标题 — 多选择器兼容 WhatsApp Web 各版本
      var title='';
      var selectors=[
        'header [data-testid="conversation-info-header-chat-title"]',
        '[data-testid="conversation-info-header-chat-title"]',
        'header [data-testid="conversation-info-header"] span[dir="auto"]',
        '#main header [data-testid="conversation-info-header-chat-title"]',
        'header h1', 'header [role="heading"]',
        '#main header span[dir="auto"]',
        'header span[aria-label]',
        'div[aria-label="Conversation info"] span[dir="auto"]',
        '#main div[role="heading"]'
      ];
      for(var i=0;i<selectors.length;i++){
        try{var el=document.querySelector(selectors[i]);if(el){title=el.textContent.replace(/\s+/g,'').trim();if(title)break;}}catch(e){}
      }
      // 修复：WhatsApp 某些版本 header 嵌套多层同号码导致重复拼接
      // 如果标题异常长（超过30字符），只取第一个完整的国际号码
      if(title.length>30){
        var m=title.match(/\+\d{7,15}/);
        if(m)title=m[0];
      }
      // 2. 尝试从聊天头部提取手机号
      var phone='';
      var subtitle=document.querySelector('[data-testid="chat-subtitle"]');
      if(subtitle){
        var t=subtitle.textContent.replace(/[^\d+]/g,'').trim();
        // 同标题修复：如果有多个+号拼接，只取第一个号码
        if(t.indexOf('+',1)>0){
          var pm=t.match(/\+\d{7,15}/);
          if(pm)t=pm[0];
        }
        if(t.length>=7&&t.length<=16)phone=t;
      }
      // 3. 尝试从所有 span 的 title 属性提取
      if(!phone){
        var allSpans=document.querySelectorAll('span[title]');
        for(var j=0;j<allSpans.length;j++){
          var m=allSpans[j].getAttribute('title').match(/\+?\d[\d\s]{6,}/);
          if(m){phone=m[0].replace(/\s/g,'');break;}
        }
      }
      // 4. 尝试从 header 的 aria-label 提取
      if(!phone){
        var headerEls=document.querySelectorAll('header [aria-label]');
        for(var k=0;k<headerEls.length;k++){
          var al=headerEls[k].getAttribute('aria-label');
          var m2=al.match(/\+?\d[\d\s]{6,}/);
          if(m2){phone=m2[0].replace(/\s/g,'');break;}
        }
      }
      return {title:title,phone:phone};
    }});
    var titleResult=tr[0].result,title=titleResult.title||'',domPhone=titleResult.phone||'';
    console.log('[CRM] 标题:',title,'手机:',domPhone);
    if(!title){showStatus(status,'请打开一个WhatsApp对话',false);return;}

    var cr=await chrome.scripting.executeScript({target:{tabId:tabs[0].id},world:'MAIN',func:async function(){
      if(!window.WPP||!window.WPP.contact)return[];
      var cs=await WPP.contact.list();
      return cs.filter(function(c){return c.id&&c.id.server==='c.us';}).map(function(c){return{
        wid:c.id._serialized||'',name:c.name||c.pushname||c.verifiedName||'',
        phone:c.id.user||'',fmt:(c.formattedUser||c.id._serialized||'').replace(/\s+/g,'').trim()
      };});
    }});
    var contacts=cr[0].result;
    // 如果WPP返回空，等5秒重试一次
    if(!contacts||!contacts.length){
      console.log('[CRM] WPP返回空，5秒后重试...');
      await new Promise(function(r){setTimeout(r,5000);});
      cr=await chrome.scripting.executeScript({target:{tabId:tabs[0].id},world:'MAIN',func:async function(){
        if(!window.WPP||!window.WPP.contact)return[];
        var cs=await WPP.contact.list();
        return cs.filter(function(c){return c.id&&c.id.server==='c.us';}).map(function(c){return{
          wid:c.id._serialized||'',name:c.name||c.pushname||c.verifiedName||'',
          phone:c.id.user||'',fmt:(c.formattedUser||c.id._serialized||'').replace(/\s+/g,'').trim()
        };});
      }});
      contacts=cr[0].result;
    }
    var titleDigits=title.replace(/[^\d]/g,'');
    console.log('[CRM] WPP联系人:',contacts.length,'个, titleDigits:',titleDigits);
    if(!contacts||!contacts.length){showStatus(status,'WPP未就绪，刷新WhatsApp页面后重试',false);return;}

    // 匹配：优先号码匹配（去掉+号对齐），再名字匹配
    var match=null;
    // 策略1: 纯数字匹配（最可靠：titleDigits vs phone/wid）
    for(var mi=0;mi<contacts.length;mi++){
      var c=contacts[mi];
      if(c.phone===titleDigits||(c.wid||'').replace('@c.us','')===titleDigits){match=c;console.log('[CRM] 策略1命中 phone:',c.phone,'wid:',c.wid);break;}
    }
    if(!match)console.log('[CRM] 策略1未命中, 前3个联系人phone样本:',contacts.slice(0,3).map(function(c){return c.phone;}));
    // 策略2: fmt(full format)匹配
    if(!match){
      match=contacts.find(function(c){
        try{return c.fmt===title;}catch(e){return false;}
      });
      if(match)console.log('[CRM] 策略2命中 fmt:',match.fmt);
    }
    // 策略3: 名字精确匹配
    if(!match){
      match=contacts.find(function(c){
        return c.name===title;
      });
    }
    // 策略4: 名字模糊匹配
    if(!match){
      match=contacts.find(function(c){
        if(!title||!c.name)return false;
        return c.name.indexOf(title)>=0||title.indexOf(c.name)>=0;
      });
    }
    // 策略5: 标题是已保存的CRM名称，直接查本地存储
    if(!match){
      // 策略5: 标题是已保存的CRM名称，查本地存储
      chrome.storage.local.get(['customers','contact_map'],function(d2){
        var custs=d2.customers||{},cmap=d2.contact_map||{};
        var found=null;
        // 直接按CRM名查
        Object.keys(custs).forEach(function(ph){
          if(custs[ph].name===title)found={phone:ph.replace(/^\+/,''),name:title};
        });
        // 按contact_map的key查
        if(!found&&cmap[title]){var ph2=cmap[title];found={phone:ph2.replace(/^\+/,''),name:custs[ph2]?custs[ph2].name:title};}
        // 策略6: 标题看起来是手机号（>=7位数字），直接用。但截断过长拼接
        if(!found&&titleDigits.length>=7){
          var cleanPhone=titleDigits;
          if(cleanPhone.length>15)cleanPhone=cleanPhone.substring(0,15); // 国际号最长15位
          found={phone:cleanPhone,name:title};
          console.log('[CRM] 策略6命中，标题即手机号:',cleanPhone);
        }
        if(found){
          finishMatch(found);
        }else{
          // 所有策略都失败了，用DOM提取的手机号做最后尝试
          if(domPhone&&domPhone.length>=7){
            finishMatch({phone:domPhone.replace(/[^\d]/g,''),name:title});
          }else{
            showStatus(status,'❌ 未识别客户，请在聊天窗口打开对话后重试',false);
          }
        }
      });
    }
    console.log('[CRM] 匹配结果:',match?match.phone:'null');
    if(match)finishMatch(match);
    else{showStatus(status,'未匹配（标题:'+title+'）',false);return;}
  }catch(e){showStatus(status,'❌ '+e.message,false);}
  finally{clearTimeout(safety);btn.innerHTML='📥 获取当前客户';btn.disabled=false;}
};

function finishMatch(match){
  var phone='+'+match.phone,name=match.name||'',country=detectCountry(match.phone);
  currentPhone=phone;

    // 立即更新卡片
    console.log('[CRM] card=',card,'cname=',cname,'cphone=',cphone);
    var today=new Date().toLocaleDateString('zh-CN');
    cname.textContent=name;cphone.textContent=phone;
    cmeta.textContent='🌍 '+country+' · 📅 '+today;
    cstatus.textContent='🆕 新客户';
    cstatus.className='cstatus new';cstatus.style.display='inline-block';
    card.classList.add('show');
    showStatus(status,'✅ 已识别客户 ('+phone+')',true);

    // 后台查是否已登记客户，自动填表
    chrome.storage.local.get(['customers'],function(d){
      var cust=d.customers||{},c=cust[phone];
      console.log('[CRM] 查已登记 phone:',phone,'found:',!!c,'keys:',Object.keys(cust).length);
      if(c){
        // ===== ALREADY REGISTERED: auto-fill everything =====
        var regDate=c.firstSeen?new Date(c.firstSeen).toLocaleDateString('zh-CN'):'未知';
        cstatus.textContent='✅ 已登记 · ⭐ '+(c.level||'C')+'级';
        cstatus.className='cstatus registered';cstatus.style.display='inline-block';
        var nextDate=c.nextFollowUp?new Date(c.nextFollowUp).toLocaleDateString('zh-CN'):'';
        cmeta.textContent='🌍 '+(c.country||country)+' · 📅 '+regDate+(nextDate?' · 🔔 '+nextDate:'');
        // Auto-fill form
        document.getElementById('fname').value=c.name||name;
        document.getElementById('fphone').value=phone;
        document.getElementById('fcountry').value=c.country||country;
        document.getElementById('flevel').value=c.level||'C';
    
        document.getElementById('fcompany').value=c.company||'';
        document.getElementById('femail').value=c.email||'';
        document.getElementById('fnotes').value=c.notes||'';
        // Auto-fill orders
        var container2 = document.getElementById('ordersContainer');
        while(container2.firstChild) container2.removeChild(container2.firstChild);
        orderCount = 0;
        var aOrders = c.orders||[];
        if(!aOrders.length && c.order1&&c.order1.product) aOrders.push(c.order1);
        if(!aOrders.length) aOrders.push({});
        aOrders.forEach(function(o){ orderCount++; var currentNum=orderCount; createOrderBlock(currentNum, o); setTimeout(function(){showFilesList(phone,currentNum,"pi");showFilesList(phone,currentNum,"pur_contract");showFilesList(phone,currentNum,"contract");showFilesList(phone,currentNum,"delivery");},100); });
        document.getElementById('btnAddOrder').style.display='block';
        showStatus(status,'✅ 已登记客户 — 信息已自动填入',true);
      }else{
        // ===== NEW CUSTOMER: form stays completely empty =====
        cstatus.textContent='🆕 新客户 — 请手动填写';
        cstatus.className='cstatus new';cstatus.style.display='inline-block';
        cmeta.textContent='🌍 '+country+' · ⭐ C级';
        document.getElementById('fname').value='';document.getElementById('fphone').value='';
        document.getElementById('fcountry').value='';document.getElementById('flevel').value='C';
        document.getElementById('fcompany').value='';document.getElementById('femail').value='';
        document.getElementById('fnotes').value='';
        // Clear orders, keep just empty order1
        var c3 = document.getElementById('ordersContainer');
        while(c3.firstChild) c3.removeChild(c3.firstChild);
        orderCount = 1;
        createOrderBlock(1, {});
        document.getElementById('btnAddOrder').style.display='block';
        showStatus(status,'🆕 新客户 — 请完善信息后保存',true);
      }
      // Save to storage + contact_map for name replacement in WhatsApp UI
      var waName = title; // original WhatsApp display name
      chrome.storage.local.get(['contact_map'],function(d2){
        var cmap = d2.contact_map || {};
        cmap[waName] = phone;
        chrome.storage.local.set({
          wa_active_chat:{phone:phone,name:name,country:country,waName:waName,time:Date.now()},
          contact_map: cmap
        });
      });
      // Record consultation (不自动创建客户，避免误标记"已登记")
      var conv=d.conversations||{};
      if(!conv[phone])conv[phone]=[];
      conv[phone].push({time:new Date().toISOString(),action:'咨询',note:'客户咨询'});
      chrome.storage.local.set({conversations:conv});
    });
  }

// =================== ORDERS: Dynamic management ===================
var orderCount = 1;
var orderNames = ['订单一','订单二','订单三','订单四','订单五'];

function getOrderInputPrefix(num){ return 'o'+num+'_'; }

// 信用证国家
function isLCCountry(country){
  return country==='阿尔及利亚'||country==='埃塞俄比亚'||country==='Algeria'||country==='Ethiopia';
}

// 切换订单详情显示
function toggleOrderDetail(num){
  var box=document.getElementById('o'+num+'_confirmed');
  var detail=document.getElementById('o'+num+'_detail');
  if(box&&detail)detail.style.display=box.checked?'block':'none';
}

// 权限检查：使用登录系统的isAdmin()
function createOrderBlock(num, data){

  var prefix = getOrderInputPrefix(num);
  var block = document.createElement('div');
  block.className = 'order-block';
  block.id = 'orderBlock'+num;
  var p=prefix;
  // 判断当前客户国家
  var customerCountry='';
  var fcountryEl=document.getElementById('fcountry');
  if(fcountryEl)customerCountry=fcountryEl.value||'';
  var showBank=isLCCountry(customerCountry);

  block.innerHTML =
    '<div class="order-title">'+
      '<span>📦 '+orderNames[num-1]+'</span>'+
      '<div style="display:flex;gap:4px">'+
        (num>1?'<button class="order-remove" data-order="'+num+'">删除</button>':'')+
      '</div>'+
    '</div>'+
    '<div class="order-body">'+
      // ===== 产品信息 =====
      '<div class="fg"><label>产品/型号</label><textarea id="'+p+'product" style="font-size:12px;resize:vertical;min-height:28px" rows="1"></textarea></div>'+
      '<div class="form-row"><div class="fg"><label>数量</label><input id="'+p+'qty" type="number" style="font-size:12px"></div><div class="fg"><label>颜色</label><input id="'+p+'color" style="font-size:12px"></div></div>'+
      '<div class="form-row"><div class="fg"><label>FOB价格(¥)</label><input id="'+p+'fob" style="font-size:12px" oninput="calcOrderProfit('+num+')"></div><div class="fg"><label>PI编号</label><input id="'+p+'pi_no" placeholder="如 PI-2025-001" style="font-size:12px"></div></div>'+
      '<div class="form-row"><div class="fg"><label>交货期</label><input id="'+p+'delivery" placeholder="如30天" style="font-size:12px"></div><div class="fg"></div></div>'+
      // PI 上传（始终可见，先于已成单）
      '<div style="margin-top:8px;padding-top:8px;border-top:1px dashed #e2e8f0">'+
        (num===1?'<div style="font-size:11px;color:#64748b;margin-bottom:6px">📎 PI 上传 <span id="piCount" style="color:#94a3b8">(本月: 0/60)</span></div>':'<div style="font-size:11px;color:#64748b;margin-bottom:6px">📎 PI 上传</div>')+
        '<div style="display:flex;align-items:center;gap:4px"><span style="font-size:10px;color:#94a3b8;min-width:20px">PI</span><input type="file" id="'+p+'pi_file" accept=".pdf,.jpg,.png,.doc,.docx" style="flex:1;font-size:10px"><button class="btn btn-sm upload-btn" data-order="'+num+'" data-type="pi" style="padding:4px 8px;background:#1a56db;color:#fff;border:none;border-radius:4px;font-size:10px;white-space:nowrap">上传</button></div>'+
        '<div style="margin-top:2px;font-size:10px" id="'+p+'pi_files"></div>'+
      '</div>'+
      // 已成单开关
      '<label style="display:flex;align-items:center;gap:6px;margin-top:8px;padding:8px;background:#f0fdf4;border:1px solid #86efac;border-radius:6px;cursor:pointer;font-size:12px">'+
        '<input type="checkbox" id="'+p+'confirmed" data-order="'+num+'" style="accent-color:#059669">'+
        '<span style="color:#059669;font-weight:600">✅ 已成单 — 填写采购/货代/销售/银行信息</span>'+
      '</label>'+
      // 以下仅在已成单时显示
      '<div id="'+p+'detail" style="display:none">'+

      // ===== 采购信息（仅管理员可见）=====
      (isAdmin()?'<details style="margin-top:6px"><summary style="font-size:12px;font-weight:600;color:#1a56db;cursor:pointer">📋 采购信息</summary>'+
      '<div style="padding:8px 0">'+
      '<div class="form-row"><div class="fg"><label>采购工厂</label><input id="'+p+'factory" style="font-size:12px"></div><div class="fg"><label>合同号</label><input id="'+p+'contract_no" style="font-size:12px"></div></div>'+
      '<div class="fg"><label>订单号</label><input id="'+p+'order_no" style="font-size:12px"></div>'+
      '<div class="form-row"><div class="fg"><label>定金日期</label><input id="'+p+'pur_deposit_date" type="date" style="font-size:12px"></div><div class="fg"><label>定金金额(¥)</label><input id="'+p+'pur_deposit_amt" style="font-size:12px" oninput="calcOrderProfit('+num+')"></div></div>'+
      '<div class="form-row"><div class="fg"><label>尾款日期</label><input id="'+p+'pur_balance_date" type="date" style="font-size:12px"></div><div class="fg"><label>尾款金额(¥)</label><input id="'+p+'pur_balance_amt" style="font-size:12px" oninput="calcOrderProfit('+num+')"></div></div>'+
      '<div class="form-row"><div class="fg"><label>FOB总价(¥)</label><input id="'+p+'pur_fob_total" style="font-size:12px;background:#f1f5f9" readonly></div><div class="fg"></div></div>'+
      '<div style="margin-top:8px;padding-top:6px;border-top:1px dashed #e2e8f0;display:flex;align-items:center;gap:4px"><span style="font-size:10px;color:#94a3b8;min-width:44px">采购合同</span><input type="file" id="'+p+'pur_contract_file" accept=".pdf,.jpg,.png,.doc,.docx" style="flex:1;font-size:10px"><button class="btn btn-sm upload-btn" data-order="'+num+'" data-type="pur_contract" style="padding:4px 8px;background:#1a56db;color:#fff;border:none;border-radius:4px;font-size:10px;white-space:nowrap">上传</button></div>'+'<div style="margin-top:2px;font-size:10px" id="'+p+'pur_contract_files"></div>'+
      '</div></details>':'')+

      // ===== 货代信息 =====
      '<details style="margin-top:6px"><summary style="font-size:12px;font-weight:600;color:#1a56db;cursor:pointer">🚢 货代信息</summary>'+
      '<div style="padding:8px 0">'+
      '<div class="fg"><label>货代公司</label><input id="'+p+'forwarder" style="font-size:12px"></div>'+
      '<div class="form-row"><div class="fg"><label>长(m)</label><input id="'+p+'dim_l" type="number" step="0.01" placeholder="m" style="font-size:12px" oninput="calcCBM('+num+')"></div><div class="fg"><label>宽(m)</label><input id="'+p+'dim_w" type="number" step="0.01" placeholder="m" style="font-size:12px" oninput="calcCBM('+num+')"></div><div class="fg"><label>高(m)</label><input id="'+p+'dim_h" type="number" step="0.01" placeholder="m" style="font-size:12px" oninput="calcCBM('+num+')"></div></div>'+
      '<div class="form-row"><div class="fg"><label>立方数</label><input id="'+p+'cbm" readonly style="font-size:12px;background:#f1f5f9"></div><div class="fg"><label>$/立方</label><input id="'+p+'cbm_price" type="number" style="font-size:12px" oninput="calcCBM('+num+')"></div><div class="fg"><label>海运费($)</label><input id="'+p+'sea_freight" readonly style="font-size:12px;background:#f1f5f9" oninput="calcOrderProfit('+num+')"></div></div>'+
      '<div class="form-row"><div class="fg"><label>船名</label><input id="'+p+'vessel" style="font-size:12px"></div><div class="fg"><label>提单号</label><input id="'+p+'bl_no" style="font-size:12px"></div></div>'+
      '<div class="form-row"><div class="fg"><label>发运日期</label><input id="'+p+'ship_date" type="date" style="font-size:12px"></div><div class="fg"><label>到港日期</label><input id="'+p+'arrival_date" type="date" style="font-size:12px"></div></div>'+
      '<div class="fg"><label>海运费打款日期</label><input id="'+p+'freight_pay_date" type="date" style="font-size:12px"></div>'+
      '</div></details>'+

      // ===== 销售信息 =====
      '<details style="margin-top:6px"><summary style="font-size:12px;font-weight:600;color:#1a56db;cursor:pointer">💰 销售信息</summary>'+
      '<div style="padding:8px 0">'+
      '<div class="fg"><label>打款公司</label><input id="'+p+'pay_company" style="font-size:12px"></div>'+
      '<div class="form-row"><div class="fg"><label>定金日期</label><input id="'+p+'deposit_date" type="date" style="font-size:12px"></div><div class="fg"><label>定金金额($)</label><input id="'+p+'deposit_amt" style="font-size:12px" oninput="calcOrderProfit('+num+')"></div></div>'+
      '<div class="form-row"><div class="fg"><label>尾款日期</label><input id="'+p+'balance_date" type="date" style="font-size:12px"></div><div class="fg"><label>尾款金额($)</label><input id="'+p+'balance_amt" style="font-size:12px" oninput="calcOrderProfit('+num+')"></div></div>'+
      '<div class="form-row"><div class="fg"><label>总成本($)</label><input id="'+p+'total_cost" style="font-size:12px" oninput="calcOrderProfit('+num+')"></div><div class="fg"><label>出售价格($)</label><input id="'+p+'sell_price" style="font-size:12px" oninput="calcOrderProfit('+num+')"></div></div>'+
      '</div></details>'+

      // ===== 银行信息（仅信用证国家）=====
      (showBank?
      '<details open style="margin-top:6px"><summary style="font-size:12px;font-weight:600;color:#dc2626;cursor:pointer">🏦 银行信息（信用证）</summary>'+
      '<div style="padding:8px 0">'+
      '<div class="form-row"><div class="fg"><label>收证日期</label><input id="'+p+'lc_receive_date" type="date" style="font-size:12px"></div><div class="fg"><label>汇丰编号</label><input id="'+p+'hsbc_no" style="font-size:12px"></div></div>'+
      '<div class="form-row"><div class="fg"><label>信用证编号</label><input id="'+p+'lc_no" style="font-size:12px"></div><div class="fg"><label>开证人</label><input id="'+p+'lc_applicant" style="font-size:12px"></div></div>'+
      '<div class="form-row"><div class="fg"><label>开证金额($)</label><input id="'+p+'lc_amount" style="font-size:12px" oninput="calcOrderProfit('+num+')"></div><div class="fg"><label>装船日期</label><input id="'+p+'lc_ship_date" type="date" style="font-size:12px"></div></div>'+
      '<div class="fg"><label>信用证截止日期</label><input id="'+p+'lc_expiry" type="date" style="font-size:12px"></div>'+
      '<div class="form-row"><div class="fg"><label>兑付日期</label><input id="'+p+'lc_pay_date" type="date" style="font-size:12px"></div><div class="fg"><label>兑付金额($)</label><input id="'+p+'lc_pay_amt" style="font-size:12px" oninput="calcOrderProfit('+num+')"></div></div>'+
      '</div></details>'
      :'')+

      // ===== 利润（仅管理员可见）=====
      (isAdmin()?'<details open style="margin-top:6px"><summary style="font-size:12px;font-weight:600;color:#059669;cursor:pointer">📊 利润</summary>'+
      '<div style="padding:8px 0">'+
      '<div style="display:flex;justify-content:space-between;font-size:11px;padding:2px 0"><span>出售价格</span><span id="'+p+'profit_sell">$0</span></div>'+
      '<div style="display:flex;justify-content:space-between;font-size:11px;padding:2px 0;color:#dc2626"><span>- '+(showBank?'兑付金额':'总成本')+'</span><span id="'+p+'profit_cost">$0</span></div>'+
      '<div style="display:flex;justify-content:space-between;font-size:11px;padding:2px 0;color:#dc2626"><span>- 海运费</span><span id="'+p+'profit_freight">$0</span></div>'+
      '<div style="display:flex;justify-content:space-between;font-size:11px;padding:2px 0;color:#dc2626"><span>- 采购成本</span><span id="'+p+'profit_pur">0</span></div>'+
      '<div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;padding:4px 0;border-top:1px solid #e2e8f0;margin-top:4px"><span>= 利润</span><span id="'+p+'profit_result" style="color:#059669">$0</span></div>'+
      '</div></details>':'')+

      // ===== 合同 + 交单（已成单后可见）=====
      '<div style="margin-top:8px;padding-top:8px;border-top:1px dashed #e2e8f0">'+
        '<div style="display:flex;align-items:center;gap:4px;margin-bottom:4px"><span style="font-size:10px;color:#94a3b8;min-width:44px">客户合同</span><input type="file" id="'+p+'contract_file" accept=".pdf,.jpg,.png,.doc,.docx" style="flex:1;font-size:10px"><button class="btn btn-sm upload-btn" data-order="'+num+'" data-type="contract" style="padding:4px 8px;background:#1a56db;color:#fff;border:none;border-radius:4px;font-size:10px;white-space:nowrap">上传</button></div>'+'<div style="margin-top:2px;font-size:10px" id="'+p+'contract_files"></div>'+
        '<div style="display:flex;align-items:center;gap:4px;margin-bottom:4px"><span style="font-size:10px;color:#94a3b8;min-width:44px">货代合同</span><input type="file" id="'+p+'freight_contract_file" accept=".pdf,.jpg,.png,.doc,.docx" style="flex:1;font-size:10px"><button class="btn btn-sm upload-btn" data-order="'+num+'" data-type="freight_contract" style="padding:4px 8px;background:#1a56db;color:#fff;border:none;border-radius:4px;font-size:10px;white-space:nowrap">上传</button></div>'+'<div style="margin-top:2px;font-size:10px" id="'+p+'freight_contract_files"></div>'+
        '<div style="display:flex;align-items:center;gap:4px"><span style="font-size:10px;color:#94a3b8;min-width:32px">交单</span><input type="file" id="'+p+'delivery_file" accept=".pdf,.jpg,.png,.doc,.docx" style="flex:1;font-size:10px"><button class="btn btn-sm upload-btn" data-order="'+num+'" data-type="delivery" style="padding:4px 8px;background:#1a56db;color:#fff;border:none;border-radius:4px;font-size:10px;white-space:nowrap">上传</button></div>'+'<div style="margin-top:2px;font-size:10px" id="'+p+'delivery_files"></div>'+
      '</div>'+
      '</div>'+  // close detail wrapper
    '</div>';
  document.getElementById('ordersContainer').appendChild(block);
  // 立即替换innerHTML创建的file input（扩展中innerHTML的file input不工作）
  ['pi','contract','pur_contract','freight_contract','delivery'].forEach(function(t){
    var oldEl=block.querySelector('#'+prefix+t+'_file');
    if(!oldEl)return;
    var newEl=document.createElement('input');
    newEl.type='file';newEl.id=prefix+t+'_file';
    newEl.accept='.pdf,.jpg,.png,.doc,.docx';
    newEl.style.cssText=oldEl.style.cssText;newEl.className=oldEl.className;
    oldEl.parentNode.replaceChild(newEl,oldEl);
  });
  if(data){fillOrderFields(num, data);}
  return block;
}

// CBM 和海运费计算
function calcCBM(num){
  var p=getOrderInputPrefix(num);
  var l=parseFloat(document.getElementById(p+'dim_l').value)||0;
  var w=parseFloat(document.getElementById(p+'dim_w').value)||0;
  var h=parseFloat(document.getElementById(p+'dim_h').value)||0;
  var cbm=l*w*h;
  document.getElementById(p+'cbm').value=cbm.toFixed(2);
  var price=parseFloat(document.getElementById(p+'cbm_price').value)||0;
  document.getElementById(p+'sea_freight').value=(cbm*price).toFixed(0);
  calcOrderProfit(num);
}

// 利润计算
function calcOrderProfit(num){
  var p=getOrderInputPrefix(num);
  var sell=parseFloat(document.getElementById(p+'sell_price').value)||0;
  var seaFreight=parseFloat(document.getElementById(p+'sea_freight').value)||0;
  var purFob=parseFloat(document.getElementById(p+'fob').value)||0;
  var purDeposit=parseFloat(document.getElementById(p+'pur_deposit_amt').value)||0;
  var purBalance=parseFloat(document.getElementById(p+'pur_balance_amt').value)||0;
  var purTotal=purDeposit+purBalance;
  // 自动填写 FOB总价
  var fobTotalEl=document.getElementById(p+'pur_fob_total');
  if(fobTotalEl&&purTotal>0)fobTotalEl.value=purTotal.toFixed(0);

  var customerCountry='';
  var fcountryEl=document.getElementById('fcountry');
  if(fcountryEl)customerCountry=fcountryEl.value||'';
  var isLC=isLCCountry(customerCountry);

  var costDeduct;
  if(isLC){
    costDeduct=parseFloat(document.getElementById(p+'lc_pay_amt').value)||0;
  }else{
    costDeduct=parseFloat(document.getElementById(p+'total_cost').value)||0;
  }

  var ps=document.getElementById(p+'profit_sell');
  if(!ps)return; // 非管理员没有利润面板
  ps.textContent='$'+sell.toLocaleString();
  document.getElementById(p+'profit_cost').textContent='$'+costDeduct.toLocaleString();
  document.getElementById(p+'profit_freight').textContent='$'+seaFreight.toLocaleString();
  document.getElementById(p+'profit_pur').textContent=purTotal.toLocaleString();

  // 利润 = 出售价 - 兑付/总成本 - 海运费 - 采购(FOB按汇率折)
  var purUSD=purTotal/(FX_RATE||7.25);
  var profit=sell-costDeduct-seaFreight-purUSD;
  var profitEl=document.getElementById(p+'profit_result');
  profitEl.textContent='$'+profit.toFixed(0);
  profitEl.style.color=profit>=0?'#059669':'#dc2626';
}

// =================== ORDER HELPERS ===================
function fillOrderFields(num, data){
  var p=getOrderInputPrefix(num);
  var el=function(id){return document.getElementById(id);};
  var fields=['product','qty','color','fob','pi_no','delivery','factory','contract_no','order_no',
    'pur_deposit_date','pur_deposit_amt','pur_balance_date','pur_balance_amt',
    'forwarder','dim_l','dim_w','dim_h','cbm','cbm_price','sea_freight',
    'vessel','bl_no','ship_date','arrival_date','freight_pay_date',
    'pay_company','deposit_date','deposit_amt','balance_date','balance_amt',
    'total_cost','sell_price',
    'lc_receive_date','hsbc_no','lc_no','lc_applicant','lc_amount','lc_ship_date','lc_expiry','lc_pay_date','lc_pay_amt'];
  for(var i=0;i<fields.length;i++){
    var f=fields[i];
    if(data[f]!==undefined&&el(p+f))el(p+f).value=data[f];
  }
  if(data.notes!==undefined&&el(p+'notes'))el(p+'notes').value=data.notes;
}

function getOrderData(num){
  var p=getOrderInputPrefix(num),d={};
  var fields=['product','qty','color','fob','pi_no','delivery','notes','factory','contract_no','order_no',
    'pur_deposit_date','pur_deposit_amt','pur_balance_date','pur_balance_amt',
    'forwarder','dim_l','dim_w','dim_h','cbm','cbm_price','sea_freight',
    'vessel','bl_no','ship_date','arrival_date','freight_pay_date',
    'pay_company','deposit_date','deposit_amt','balance_date','balance_amt',
    'total_cost','sell_price',
    'lc_receive_date','hsbc_no','lc_no','lc_applicant','lc_amount','lc_ship_date','lc_expiry','lc_pay_date','lc_pay_amt'];
  for(var i=0;i<fields.length;i++){
    var f=fields[i],el=document.getElementById(p+f);
    if(el)d[f]=el.value;
  }
  return d;
}

function removeOrder(num){
  var block=document.getElementById('orderBlock'+num);
  if(block)block.remove();
  orderCount--;
  if(orderCount===1){
    var b1=document.getElementById('orderBlock1');
    if(b1){var rb=b1.querySelector('.order-remove');if(rb)rb.remove();}
  }
}

function collectAllOrders(){
  var orders=[];
  for(var i=1;i<=orderCount;i++){
    var block=document.getElementById('orderBlock'+i);
    if(block)orders.push(getOrderData(i));
  }
  return orders;
}

// =================== CUSTOMER: Fill form ===================
document.getElementById('btnFill').onclick=function(){
  if(!currentPhone){showStatus(status,'请先点击"获取当前客户"',false);return;}
  var name=cname.textContent,phone=cphone.textContent;
  var cm=cmeta.textContent.match(/🌍\s*(\S+)/),country=cm?cm[1]:'';
  document.getElementById('fname').value=name;
  document.getElementById('fphone').value=phone;
  document.getElementById('fcountry').value=country;
  chrome.storage.local.get(['customers'],function(d){
    var c=(d.customers||{})[currentPhone];
    document.getElementById('flevel').value=(c&&c.level)||'C';
    document.getElementById('fcompany').value=(c&&c.company)||'';
    document.getElementById('femail').value=(c&&c.email)||'';
    document.getElementById('fnotes').value=(c&&c.notes)||'';
    // Clear & reload orders
    var container = document.getElementById('ordersContainer');
    while(container.firstChild) container.removeChild(container.firstChild);
    orderCount = 0;
    var orders = (c&&c.orders)||[];
    // Legacy: migrate old order1/order2 format
    if(!orders.length && c){
      if(c.order1&&c.order1.product) orders.push(c.order1);
      if(c.order2&&c.order2.product) orders.push(c.order2);
    }
    if(!orders.length) orders.push({});
    orders.forEach(function(o,i){
      orderCount++;
      createOrderBlock(orderCount, o);
    });
    document.getElementById('btnAddOrder').style.display='block';
    if(c){
      cstatus.textContent='✅ 已登记 · ⭐ '+(c.level||'C')+'级';
      cstatus.className='cstatus registered';cstatus.style.display='inline-block';
    }
    showStatus(status,'✍️ 已填写',true);
  });
};

// 💬 查看聊天记录
document.getElementById('btnViewChat').onclick=function(){
  // 自动从WhatsApp获取当前客户手机号
  chrome.tabs.query({url:'*://web.whatsapp.com/*'},function(tabs){
    if(!tabs.length){alert('请先打开WhatsApp Web');return;}
    chrome.scripting.executeScript({
      target:{tabId:tabs[0].id},world:'MAIN',
      func:function(){try{var a=WPP.chat.getActiveChat();return a&&a.id?(a.id.user||a.id._serialized.replace('@c.us','')):null;}catch(e){return null;}}
    }).then(function(r){
      var phone=r[0].result;
      if(!phone){alert('请先在WhatsApp中打开一个聊天');return;}
      showChatHistory(phone);
    });
  });
};

function showChatHistory(phone){
  chrome.storage.local.get(['chat_history'],function(d){
    var hist=d.chat_history||{},cust=hist[phone];
    if(!cust||!Object.keys(cust).length){alert(phone+' 暂无聊天记录');return;}
    var days=Object.keys(cust).sort().reverse();
    var html='<div class="chat-modal-overlay" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:9999;overflow:auto"><div style="max-width:450px;margin:20px auto;background:#fff;border-radius:12px;overflow:hidden"><div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:#fefce8;border-bottom:2px solid #eab308"><span style="font-weight:700;color:#92400e">💬 '+currentPhone+' 聊天记录</span><button class="chat-modal-close" style="background:none;border:none;color:#92400e;font-size:18px;cursor:pointer">&times;</button></div><div style="padding:12px;max-height:550px;overflow:auto">';
    days.forEach(function(day){
      html+='<div style="font-weight:700;color:#64748b;font-size:11px;margin:8px 0 4px;padding:4px 8px;background:#f8fafc;border-radius:4px">📅 '+day+' ('+cust[day].length+'条)</div>';
      cust[day].forEach(function(m){
        var isMe=m.sender==='我';
        html+='<div style="margin:4px 0;display:flex;flex-direction:'+(isMe?'row-reverse':'row')+'"><div style="max-width:75%;padding:6px 10px;border-radius:10px;font-size:11px;line-height:1.5;'+(isMe?'background:#dbeafe;color:#1e40af':'background:#f1f5f9;color:#334155')+'"><b style="font-size:10px">'+(isMe?'我':'客户')+'</b><br>'+m.text.replace(/</g,'&lt;')+'</div></div>';
      });
    });
    html+='</div></div></div>';
    document.body.insertAdjacentHTML('beforeend',html);
    // 事件委托：关闭和点击遮罩
    setTimeout(function(){
      var overlay=document.querySelector('.chat-modal-overlay');
      if(!overlay)return;
      overlay.addEventListener('click',function(e){
        if(e.target===overlay||e.target.classList.contains('chat-modal-close'))
          overlay.remove();
      });
    },100);
  });
};

// Initialize order1 + new order button
createOrderBlock(1);
document.getElementById('btnAddOrder').onclick = function(){
  orderCount++;
  createOrderBlock(orderCount);
};

// =================== CRM SERVER SYNC ===================
var CRM_API = 'http://47.96.255.110/api/crm';

// Save customer to server
function syncToServer(phone, data, callback) {
  fetch(CRM_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phone: phone,
      name: data.name || '',
      email: data.email || '',
      country: data.country || '',
      company: data.company || '',
      level: data.level || 'C',
      product: data.product || '',
      category: data.category || '',
      owner: data.owner || '',
      notes: data.notes || '',
      orders: data.orders || [],
      pis: data.pis || [],
      assignedTo: data.assignedTo || '',
      nextFollowUp: data.nextFollowUp || null,
      hasConfirmedOrder: data.hasConfirmedOrder || false,
      firstSeen: data.firstSeen || new Date().toISOString()
    })
  })
  .then(function(r) { return r.json(); })
  .then(function(result) {
    if (callback) callback(null, result);
  })
  .catch(function(e) {
    console.log('Sync error (server maybe offline):', e.message);
    if (callback) callback(e, null);
  });
}

// 将无回访记录的客户平均分配到接下来的30个工作日
function getDistributedFollowUp(phone, level) {
  // 从下周一（或明天，看哪个更近）开始分配
  var d = new Date();
  // 跳到下周一（如果是周末）或明天
  var day = d.getDay();
  if (day === 5) d.setDate(d.getDate() + 3);      // 周五 → 下周一
  else if (day === 6) d.setDate(d.getDate() + 2);  // 周六 → 下周一
  else d.setDate(d.getDate() + 1);                  // 周日-周四 → 明天
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
  // 手机号哈希 → 0~29 天
  var hash = 0;
  for (var i = 0; i < phone.length; i++) hash = ((hash << 5) - hash) + phone.charCodeAt(i);
  var offset = Math.abs(hash) % 300;  // 300个工作日≈14个月，约87人/天
  // 跳到目标工作日
  for (var j = 0; j < offset; j++) {
    d.setDate(d.getDate() + 1);
    while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
  }
  return d.toISOString().slice(0, 10);
}

// Load all customers from server on startup
function syncFromServer() {
  console.log('[CRM] 开始同步服务器...');
  // 非管理员用搜索参数只拉自己的客户
  var url = CRM_API;
  if (!isAdmin() && currentUser) {
    var empName = currentUser.name;
    if (empName === '毛振威') empName = '毛震威';
    if (empName === '杜飞跃') empName = '杜飞月';
    url += '?search=' + encodeURIComponent(empName);
  }
  fetch(url)
    .then(function(r) { console.log('[CRM] 服务器响应:',r.status); return r.json(); })
    .then(function(data) {
      console.log('[CRM] 收到数据, contacts数量:',(data.contacts||[]).length);
      var contacts = data.contacts || [];
      if (!contacts.length) return;
      chrome.storage.local.get(['customers'], function(d) {
        var local = d.customers || {};
        var localEmpty = !Object.keys(local).length;
        var merged = false;
        contacts.forEach(function(c) {
          var phone = c.phone;
          // 如果本地为空（首次安装/数据丢失），无条件从服务器恢复所有数据
          // 否则只同步更新的数据
          if (localEmpty || !local[phone] || new Date(c.updatedAt || c.updated_at || 0) > new Date((local[phone].updatedAt || '1970')) || (!c.nextFollowUp && !c.next_follow_up)) {
            local[phone] = {
              phone: phone,
              name: c.name || '',
              email: c.email || '',
              country: c.country || '',
              company: c.company || '',
              level: c.level || 'C',
              products: c.product || '',
              notes: c.notes || '',
              orders: typeof c.orders === 'string' ? JSON.parse(c.orders) : (c.orders || []),
              firstSeen: c.firstSeen || c.first_seen || '',
              nextFollowUp: c.nextFollowUp || c.next_follow_up || (c.lastFollowUp || c.last_follow_up ? getDefaultFollowUp(c.level) : getDistributedFollowUp(phone, c.level)),
              lastFollowUp: c.lastFollowUp || c.last_follow_up || '',
              assignedTo: c.assignedTo || c.assigned_to || '',
              updatedAt: c.updatedAt || c.updated_at || ''
            };
            merged = true;
          }
        });
        if (merged) {
          chrome.storage.local.set({ customers: local }, function() {
            console.log('[CRM] ' + (localEmpty ? '数据已从服务器恢复: ' : '已同步: ') + contacts.length + ' 条客户记录');
          });
        }
      });
    })
    .catch(function(e) {
      console.log('[CRM] 服务器同步失败:', e.message, '— 尝试从WhatsApp localStorage恢复...');
      // 服务器不通时，尝试从WhatsApp页面的localStorage恢复
      chrome.storage.local.get(['customers'], function(d) {
        var local = d.customers || {};
        if (Object.keys(local).length > 0) return;  // 本地已有数据，不需要恢复
        // 从WhatsApp页面读取备份
        chrome.tabs.query({ url: '*://web.whatsapp.com/*' }, function(tabs) {
          if (!tabs.length) { 
            console.log('[CRM] 无WhatsApp标签页，30秒后重试...');
            setTimeout(function() { if (!Object.keys(local).length) syncFromServer(); }, 30000);
            return; 
          }
          chrome.tabs.sendMessage(tabs[0].id, { action: 'restoreFromLocalStorage' }, function(resp) {
            if (chrome.runtime.lastError || !resp || !resp.ok) {
              console.log('[CRM] localStorage备份不可用，30秒后重试服务器...');
              setTimeout(function() { syncFromServer(); }, 30000);
              return;
            }
            var restored = resp.customers || {};
            var keys = Object.keys(restored);
            // 恢复客户数据
            keys.forEach(function(phone) {
              var c = restored[phone];
              local[phone] = Object.assign(local[phone] || {}, c, {
                updatedAt: c.updatedAt || new Date().toISOString()
              });
            });
            chrome.storage.local.set({ customers: local }, function() {
              console.log('[CRM] ✅ 已从WhatsApp localStorage恢复 ' + keys.length + ' 条客户');
            });
            // 恢复PI/合同/交单文件元数据
            if (resp.doc_records) {
              chrome.storage.local.get(['doc_records'], function(dr) {
                var existing = dr.doc_records || {};
                Object.keys(resp.doc_records).forEach(function(k) {
                  if (!existing[k]) existing[k] = resp.doc_records[k];
                });
                chrome.storage.local.set({ doc_records: existing });
              });
            }
            // 恢复聊天记录
            if (resp.chat_history) {
              chrome.storage.local.get(['chat_history'], function(ch) {
                var existing = ch.chat_history || {};
                Object.keys(resp.chat_history).forEach(function(phone) {
                  if (!existing[phone]) existing[phone] = {};
                  Object.keys(resp.chat_history[phone] || {}).forEach(function(dt) {
                    if (!existing[phone][dt]) existing[phone][dt] = resp.chat_history[phone][dt];
                  });
                });
                chrome.storage.local.set({ chat_history: existing });
              });
            }
            // 恢复考勤记录
            if (resp.attendance) {
              chrome.storage.local.get(['attendance'], function(at) {
                var existing = at.attendance || {};
                Object.keys(resp.attendance).forEach(function(date) {
                  if (!existing[date]) existing[date] = resp.attendance[date];
                  else Object.assign(existing[date], resp.attendance[date]);
                });
                chrome.storage.local.set({ attendance: existing });
              });
            }
          });
        });
      });
    });
}

// Sync on startup
// syncFromServer() called from initApp above
document.getElementById('btnSave').onclick=function(){
var CHINESE_HOLIDAYS_2025_2026=["2025-01-01","2025-01-28","2025-01-29","2025-01-30","2025-01-31","2025-02-01","2025-02-02","2025-02-03","2025-02-04","2025-04-04","2025-04-05","2025-04-06","2025-05-01","2025-05-02","2025-05-03","2025-05-04","2025-05-05","2025-05-31","2025-06-01","2025-06-02","2025-10-01","2025-10-02","2025-10-03","2025-10-04","2025-10-05","2025-10-06","2025-10-07","2025-10-08","2026-01-01","2026-02-17","2026-02-18","2026-02-19","2026-02-20","2026-02-21","2026-02-22","2026-02-23","2026-04-05","2026-05-01","2026-05-02","2026-05-03","2026-06-19","2026-06-20","2026-06-21","2026-10-01","2026-10-02","2026-10-03","2026-10-04","2026-10-05","2026-10-06","2026-10-07"];
function isHolidayOrWeekend(d){var w=d.getDay();if(w===0||w===6)return true;return CHINESE_HOLIDAYS_2025_2026.indexOf(d.toISOString().slice(0,10))>=0;}
function getDefaultFollowUp(level) {
  var d = new Date();
  d.setDate(d.getDate() + (level==='A'?15:level==='B'?30:60));
  while (d.getDay()===0||d.getDay()===6) d.setDate(d.getDate()+1);
  return d.toISOString().slice(0,10);
}
function getNextWorkday(from,add){var d=new Date(from.getTime()+add*86400000);while(isHolidayOrWeekend(d))d=new Date(d.getTime()+86400000);return d;}
function getFollowUpDays(l){return l==='A'?15:l==='B'?30:60;}

  if(!currentPhone){showStatus(status,'请先获取客户',false);return;}
  console.log('[CRM] 保存中 phone:',currentPhone);
  chrome.storage.local.get(['customers'],function(d){
    var cust=d.customers||{};
    cust[currentPhone]=Object.assign(cust[currentPhone]||{},{phone:currentPhone,
      name:document.getElementById('fname').value,country:document.getElementById('fcountry').value,
      level:document.getElementById('flevel').value,company:document.getElementById('fcompany').value,
      email:document.getElementById('femail').value,
      orders:collectAllOrders(),
      notes:document.getElementById('fnotes').value,updatedAt:new Date().toISOString(),
      firstSeen: (cust[currentPhone] && cust[currentPhone].firstSeen) || new Date().toISOString(),
      nextFollowUp:getNextWorkday(new Date(),getFollowUpDays(document.getElementById('flevel').value)).toISOString(),
      hasConfirmedOrder:document.querySelector('[id$="_confirmed"]:checked')?true:false});
    // 同时读取 contact_map → 一次 set 原子写入，确保 content.js 立即拿到完整数据
    chrome.storage.local.get(['contact_map','wa_active_chat'],function(d2){
      var cmap=d2.contact_map||{},wa=d2.wa_active_chat;
      if(wa&&wa.waName){cmap[wa.waName]=currentPhone;}
      chrome.storage.local.set({customers:cust,contact_map:cmap},function(){
      console.log('[CRM] 已保存到本地');
      cstatus.textContent='✅ 已登记 · ⭐ '+(cust[currentPhone].level||'C')+'级';
      cstatus.className='cstatus registered';cstatus.style.display='inline-block';
      showStatus(status,'💾 已保存',true);
      console.log('[CRM] 保存完成');
      // Also sync to server
      trackActivity("save",currentPhone);syncToServer(currentPhone, cust[currentPhone]);
    });
  });
  });
};

// =================== PRODUCT: Country search + category/drive filter ===================
var selectedCountry='',prodsData={};



function loadProductData(){
  chrome.storage.local.get(['products','lastBrand','lastCountry','lastCat','lastDrive'],function(d){
    // Defaults if never set
    var brand=d.lastBrand||'中国重汽';
    var country=d.lastCountry||'';
    var cat=d.lastCat||'牵引车';
    var drive=d.lastDrive||'6×4';
    // Save defaults so they persist
    chrome.storage.local.set({lastBrand:brand,lastCountry:country,lastCat:cat,lastDrive:drive});
    // Init brand dropdown
    var brandSel=document.getElementById('brandSelect');
    brandSel.innerHTML='<option value="">全部品牌</option>'+Object.keys(CATEGORIES_BY_BRAND).map(function(k){return'<option value="'+k+'">'+k+'</option>';}).join('');
    brandSel.value=brand;
    brandSel.onchange=function(){
      var b=this.value;chrome.storage.local.set({lastBrand:b||'中国重汽'});
      updateCatSelect(b,cat);
      updateDriveSelect(b,drive);
    };
    updateCatSelect(brand,cat);
    // Country typeahead
    var inp=document.getElementById('countryInput');
    inp.value=country;selectedCountry=country;
    inp.oninput=function(){
      var q=this.value.toLowerCase(),drop=document.getElementById('countryDrop');
      if(!q){drop.style.display='none';return;}
      var keys=Object.keys(prodsData);
      // If only has 阿尔及利亚 (default), fetch fresh from server
      if(keys.length<=1&&keys[0]==='阿尔及利亚'){
        drop.innerHTML='<div style=\"color:#999\">加载中...</div>';drop.style.display='block';
        fetch(PRODUCTS_API).then(function(r){return r.json();}).then(function(rd){
          applyConfig(rd.config);
          var sp=rd.products;
          if(sp&&Object.keys(sp).length){
            Object.keys(sp).forEach(function(ct){if(ct==='undefined')return;if(!prodsData[ct])prodsData[ct]={};});
          }
          doSearch(q,drop);
        }).catch(function(){drop.style.display='none';});
      }else{
        doSearch(q,drop);
      }
    };
    function doSearch(q,drop){
      var matches=Object.keys(prodsData).filter(function(k){return k.toLowerCase().indexOf(q)>=0;}).slice(0,8);
      drop.innerHTML=matches.map(function(k){return'<div>'+k+'</div>';}).join('');
      drop.style.display=matches.length?'block':'none';
      drop.querySelectorAll('div').forEach(function(div){div.onclick=function(){
        inp.value=this.textContent;drop.style.display='none';
        selectedCountry=this.textContent;chrome.storage.local.set({lastCountry:selectedCountry});
      };});
    };
    document.addEventListener('click',function(e){if(!e.target.closest('#countryInput')&&!e.target.closest('#countryDrop'))document.getElementById('countryDrop').style.display='none';});
    // Drive dropdown
    updateDriveSelect(brand,drive);
    var driveSel=document.getElementById('driveSelect');
    driveSel.onchange=function(){chrome.storage.local.set({lastDrive:this.value});};
    // Category onchange
    document.getElementById('catSelect').onchange=function(){chrome.storage.local.set({lastCat:this.value});};
    // Search button
    document.getElementById('btnSearch').onclick=filterProducts;
    filterProducts();
  });
}

function updateCatSelect(brand,lastCat){
  var catSel=document.getElementById('catSelect');
  var cats=CATEGORIES_BY_BRAND[brand]||[];
  if(!cats.length){
    // Flatten categories across all brands for the selected country
    var allBrands=((prodsData&&Object.keys(prodsData).length?prodsData:DEFAULT_PRODUCTS)[selectedCountry||'']||{});
    var catSet={};
    Object.keys(allBrands).forEach(function(bn){
      Object.keys(allBrands[bn]||{}).forEach(function(cn){catSet[cn]=true;});
    });
    cats=Object.keys(catSet);
  }
  catSel.innerHTML='<option value="">全部车型</option>'+cats.map(function(k){return'<option value="'+k+'">'+k+'</option>';}).join('');
  catSel.onchange=function(){chrome.storage.local.set({lastCat:this.value});};
  if(lastCat){catSel.value=lastCat;setTimeout(function(){catSel.value=lastCat;},50);}
}
function updateDriveSelect(brand,lastDrive){
  var drives=brand==='轻型车'?['4×2','4×4']:DRIVES;
  var driveSel=document.getElementById('driveSelect');
  driveSel.innerHTML='<option value="">全部驱动</option>'+drives.map(function(k){return'<option value="'+k+'">'+k+'</option>';}).join('');
  if(lastDrive){driveSel.value=lastDrive;setTimeout(function(){driveSel.value=lastDrive;},50);}
}


function editProduct(country,brand,cat,drive,idx){
  var prods=prodsData[country][brand][cat][drive];
  var p=prods[idx];
  if(!p)return;
  var ec=document.getElementById('editCountry');ec.value=country;ec.dataset.old=country;
  var eb=document.getElementById('editBrand');eb.value=brand;eb.dataset.old=brand;
  var et=document.getElementById('editCat');et.value=cat;et.dataset.old=cat;
  var ed=document.getElementById('editDrive');ed.value=drive;ed.dataset.old=drive;
  document.getElementById('editIdx').value=idx;
  document.getElementById('editName').value=p.model||p.name||'';
  document.getElementById('editFob').value=p.fob||'';
  document.getElementById('editShipping').value=p.shipping||'';
  document.getElementById('editCfr').value=p.cfr||'';
  document.getElementById('editConfig').value=p.config||p.engine||'';
  document.getElementById('editProductModal').style.display='block';
}
function saveEditProduct(){
  var oldCountry=document.getElementById('editCountry').dataset.old||document.getElementById('editCountry').value;
  var oldBrand=document.getElementById('editBrand').dataset.old||document.getElementById('editBrand').value;
  var oldCat=document.getElementById('editCat').dataset.old||document.getElementById('editCat').value;
  var oldDrive=document.getElementById('editDrive').dataset.old||document.getElementById('editDrive').value;
  var country=document.getElementById('editCountry').value.trim();
  var brand=document.getElementById('editBrand').value.trim();
  var cat=document.getElementById('editCat').value.trim();
  var drive=document.getElementById('editDrive').value.trim();
  var idx=parseInt(document.getElementById('editIdx').value);
  var name=document.getElementById('editName').value.trim();
  var fob=document.getElementById('editFob').value;
  var shipping=document.getElementById('editShipping').value;
  var cfr=document.getElementById('editCfr').value;
  var config=document.getElementById('editConfig').value.trim();
  var pstatus=document.getElementById('editpStatus');
  if(!country||!brand||!cat||!drive){pstatus.textContent='❌ 国家/品牌/车型/驱动必填';pstatus.className='status show err';return;}
  if(!name){pstatus.textContent='❌ 名称必填';pstatus.className='status show err';return;}
  if(!fob||parseFloat(fob)<=0){pstatus.textContent='❌ FOB必填';pstatus.className='status show err';return;}
  pstatus.textContent='⏳ 保存中...';pstatus.className='status show ok';
  var p=prodsData[oldCountry][oldBrand][oldCat][oldDrive][idx];
  p.model=name;p.name=name;p.fob=fob;p.shipping=shipping||'0';p.cfr=cfr||'0';
  if(config)p.config=config;p.engine=config;
  // If path changed, move the product
  if(country!==oldCountry||brand!==oldBrand||cat!==oldCat||drive!==oldDrive){
    if(!prodsData[country])prodsData[country]={};
    if(!prodsData[country][brand])prodsData[country][brand]={};
    if(!prodsData[country][brand][cat])prodsData[country][brand][cat]={};
    if(!prodsData[country][brand][cat][drive])prodsData[country][brand][cat][drive]=[];
    prodsData[country][brand][cat][drive].push(p);
    prodsData[oldCountry][oldBrand][oldCat][oldDrive].splice(idx,1);
  }
  fetch(PRODUCTS_API,{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({batch:prodsData})
  }).then(function(r){return r.json();}).then(function(data){
    if(data.success){
      pstatus.textContent='✅ 已保存';
      document.getElementById('editProductModal').style.display='none';
      filterProducts();
    }else{pstatus.textContent='❌ 保存失败';}
    pstatus.className='status show '+(data.success?'ok':'err');
  }).catch(function(){pstatus.textContent='❌ 网络错误';pstatus.className='status show err';});
}

setTimeout(function(){
  var bse=document.getElementById('btnSaveEdit');
  if(bse)bse.onclick=saveEditProduct;
},1000);
function filterProducts(){
  var brand=document.getElementById('brandSelect').value,cat=document.getElementById('catSelect').value,drive=document.getElementById('driveSelect').value;
  var pl=document.getElementById('productList');
  pl.innerHTML='<div class="prod-empty"><span class="spin"></span>查询中...</div>';
  // Fetch latest from server, merge, then search
  fetch(PRODUCTS_API).then(function(r){return r.json();}).then(function(rd){
    applyConfig(rd.config);
    var sp=rd.products;
    if(sp&&Object.keys(sp).length){
      Object.keys(sp).forEach(function(ct){if(ct==='undefined')return;
        if(!prodsData[ct])prodsData[ct]={};
        Object.keys(sp[ct]).forEach(function(bn){if(!prodsData[ct][bn])prodsData[ct][bn]={};
          Object.keys(sp[ct][bn]).forEach(function(cn){if(!prodsData[ct][bn][cn])prodsData[ct][bn][cn]={};
            Object.keys(sp[ct][bn][cn]).forEach(function(dn){if(!prodsData[ct][bn][cn][dn])prodsData[ct][bn][cn][dn]=[];
              sp[ct][bn][cn][dn].forEach(function(p){var k=(p.name||p.model||'');if(!prodsData[ct][bn][cn][dn].some(function(e){return(e.name||e.model||'')===k;}))prodsData[ct][bn][cn][dn].push(p);});
            });
          });
        });
      });
    }
    // Now search with merged data
    var data=(prodsData&&Object.keys(prodsData).length)?prodsData:DEFAULT_PRODUCTS;
  var inpCountry=document.getElementById('countryInput');
  var country=(inpCountry&&inpCountry.value.trim())||selectedCountry||'';
  if(inpCountry&&inpCountry.value.trim())selectedCountry=inpCountry.value.trim();
  // If no country selected, show all countries
  var brands;
  if(!country){
    brands={};
    Object.keys(data).forEach(function(ct){
      Object.keys(data[ct]||{}).forEach(function(bn){
        if(!brands[bn])brands[bn]={};
        var src=data[ct][bn]||{};
        Object.keys(src).forEach(function(cn){
          if(!brands[bn][cn])brands[bn][cn]={};
          Object.keys(src[cn]||{}).forEach(function(dn){
            if(!brands[bn][cn][dn])brands[bn][cn][dn]=[];
            (src[cn][dn]||[]).forEach(function(p){
              var k=(p.name||p.model||'');
              if(!brands[bn][cn][dn].some(function(e){return(e.name||e.model||'')===k;}))brands[bn][cn][dn].push(p);
            });
          });
        });
      });
    });
  }else{
    brands=data[country];
  }
  console.log('[CRM] filterProducts: country='+(country||'全部')+', available:',Object.keys(data).join(','));
  if(!brands){document.getElementById('productList').innerHTML='<div class="prod-empty">未找到产品数据 (国家:'+country+')</div>';return;}
  var pl=document.getElementById('productList'),h='';
  Object.keys(brands).forEach(function(brandName){
    if(brand&&brand!=='中国重汽'){
      var bl=brandName.toLowerCase();
      if(brand==='陕汽'&&bl.indexOf('shacman')<0)return;
      if(brand==='徐工'&&bl.indexOf('xcmg')<0)return;
      if(brand==='中集'&&bl.indexOf('cimc')<0)return;
    }else if(brand==='中国重汽'){
      var bl=brandName.toLowerCase();
      if(bl==='中国重汽'.toLowerCase()){}
      else if(bl.indexOf('howo')<0&&bl.indexOf('tx')<0&&bl.indexOf('t7h')<0&&bl.indexOf('sitrak')<0&&bl.indexOf('sinotruk')<0)return;
    }
    var cats=brands[brandName];
    Object.keys(cats).forEach(function(catName){
      if(cat&&cat!==catName)return;
      var drives=cats[catName];
      Object.keys(drives).forEach(function(driveName){
        var normDrive=driveName.replace(/×/g,'x').replace(/X/g,'x');
        var normSel=drive.replace(/×/g,'x').replace(/X/g,'x');
        if(drive&&normDrive!==normSel)return;
        var displayDrive=driveName.replace(/x/gi,'×');
        var items=drives[driveName];
        h+='<div style="padding:6px 12px;background:#f1f5f9;font-size:11px;font-weight:700;color:#64748b">'+brandName+' · '+catName+' · '+displayDrive+'</div>';
        items.forEach(function(p){
          h+='<div class="product-item" data-model="'+esc(p.model||p.name||'')+'" data-fob="'+esc(p.fob)+'" data-shipping="'+esc(p.shipping||'')+'" data-cfr="'+esc(p.cfr||'')+'" data-config="'+esc(p.config||p.engine||'')+'">'+
            '<div class="pname">'+esc(p.model||p.name||'')+(isAdmin()?' <span class="price-tag fob-tag edit-prod-btn" style="cursor:pointer;font-size:9px" data-country="'+esc(country)+'" data-brand="'+esc(brandName)+'" data-cat="'+esc(catName)+'" data-drive="'+esc(displayDrive)+'" data-idx="'+items.indexOf(p)+'">✏️</span>':'')+'</div>'+
            '<div class="pdetail" style="cursor:pointer" title="单击发送配置">⚙️ '+esc(p.config||p.engine||'').replace(/\\n/g,' | ').replace(/\n/g,' | ').substring(0,80)+'...</div>'+
            '<div class="pdetail" style="display:flex;gap:8px;margin-top:4px">'+
              '<span class="price-tag fob-tag" title="单击发送FOB">FOB: '+(p.fob&&p.fob!=='0'?esc(p.fob):'未填')+'</span>'+
              '<span class="price-tag ship-tag" title="单击发送海运">🚢 '+esc(p.shipping||'—')+'</span>'+
              '<span class="price-tag cfr-tag" title="单击发送CFR">CFR: <b>'+esc(p.cfr||p.fob||'—')+'</b></span>'+
            '</div></div>';
        });
      });
    });
  });
  pl.innerHTML=h||'<div class="prod-empty">无匹配产品</div>';
  pl.querySelectorAll('.product-item').forEach(function(item){
    item.onclick=function(e){
      if(e.target.closest('.edit-prod-btn')){var eb=e.target.closest('.edit-prod-btn');editProduct(eb.dataset.country,eb.dataset.brand,eb.dataset.cat,eb.dataset.drive,parseInt(eb.dataset.idx));return;}
      if(e.target.closest('.fob-tag')){sendToWhatsApp('FOB Price: '+this.dataset.fob);showStatus(document.getElementById('pstatus'),'FOB已填入',true);return;}
      if(e.target.closest('.ship-tag')){sendToWhatsApp('Sea Freight: '+(this.dataset.shipping||'—'));showStatus(document.getElementById('pstatus'),'海运已填入',true);return;}
      if(e.target.closest('.cfr-tag')){sendToWhatsApp('CFR Price: '+(this.dataset.cfr||this.dataset.fob||'—'));showStatus(document.getElementById('pstatus'),'CFR已填入',true);return;}
      var cfg=this.dataset.config.replace(/⏎/g,'\n');if(!cfg)cfg=this.dataset.config;
      sendToWhatsApp('Model: '+this.dataset.model+'\n\n'+cfg+'\n\nFOB Price: '+this.dataset.fob+(this.dataset.shipping?'\nSea Freight: '+this.dataset.shipping:'')+(this.dataset.cfr?'\nCFR Price: '+this.dataset.cfr:''));showStatus(document.getElementById('pstatus'),'报价已填入',true);
    };
  });
  }).catch(function(){pl.innerHTML='<div class="prod-empty">网络错误，请重试</div>';});
}


function esc(s){return(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/\n/g,'⏎');}
function unescCfg(s){return(s||'').replace(/⏎/g,'\\n');}

// ===== Reply library: load from storage =====
function loadReplies(){
  chrome.storage.local.get(['replies'],function(d){
    repliesData=(d.replies&&d.replies.length)?d.replies:DEFAULT_REPLIES;
    renderReplies();
  });
}

// ===== Reply library: search + auto-filter =====
function renderReplies(){
  var q=(document.getElementById('replySearch').value||'').toLowerCase().trim();
  var rl=document.getElementById('replyList');
  var list=q ? repliesData.filter(function(r){
    return r.code.toLowerCase().indexOf(q)>=0 || (r.name||'').toLowerCase().indexOf(q)>=0 || (r.en||'').toLowerCase().indexOf(q)>=0 || (r.fr||'').toLowerCase().indexOf(q)>=0 || (r.ar||'').toLowerCase().indexOf(q)>=0;
  }) : repliesData;
  if(!list.length){rl.innerHTML='<div class="reply-empty">无匹配话术</div>';return;}
  rl.innerHTML=list.map(function(r){
    return'<div class="reply-card"><div class="rcode">'+esc(r.name||'')+'</div>'+
      (r.en?'<div class="rlang-row" data-text="'+esc(r.en)+'"><span class="rlang-tag">EN</span><span class="rlang-text">'+esc(r.en)+'</span></div>':'')+
      (r.fr?'<div class="rlang-row" data-text="'+esc(r.fr)+'"><span class="rlang-tag">FR</span><span class="rlang-text">'+esc(r.fr)+'</span></div>':'')+
      (r.ar?'<div class="rlang-row" data-text="'+esc(r.ar)+'"><span class="rlang-tag">AR</span><span class="rlang-text">'+esc(r.ar)+'</span></div>':'')+
    '</div>';
  }).join('');
  bindReplyClicks(rl);
}

function bindReplyClicks(rl){
  rl.querySelectorAll('.rlang-row').forEach(function(row){
    row.onclick=function(){sendToWhatsApp(this.dataset.text);showStatus(document.getElementById('rstatus'),'💬 已填入',true);};
  });
}

var lastTranslation=null,repliesData=[];

// ===== Translate =====
async function doTranslate(){
  var text=document.getElementById('translateInput').value.trim();
  if(!text){showStatus(document.getElementById('rstatus'),'请输入文字',false);return;}
  var results=document.getElementById('translateResults');
  results.innerHTML='<div style="text-align:center;padding:12px;color:#94a3b8"><span class="spin"></span>翻译中...</div>';
  try{
    var promises=['en','fr','ar'].map(function(lang){
      var url='https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl='+lang+'&dt=t&q='+encodeURIComponent(text);
      return fetch(url).then(function(r){return r.json();}).then(function(d){
        var translated='';
        if(d&&d[0]){d[0].forEach(function(s){if(s&&s[0])translated+=s[0];});}
        return {lang:lang,text:translated||'(失败)'};
      }).catch(function(){return {lang:lang,text:'(网络错误)'};});
    });
    var arr=await Promise.all(promises);
    lastTranslation={original:text,en:arr[0].text,fr:arr[1].text,ar:'\u200F\u200F'+arr[2].text};
    // Auto-suggest code number
    var nextCode=String(repliesData.length+1).padStart(3,'0');
    document.getElementById('translateCode').value=nextCode;
    results.innerHTML=
      '<div style="font-size:11px;font-weight:600;color:#475569;margin-bottom:4px;display:flex;justify-content:space-between">翻译结果：<button class="btn-sm" id="btnCopyWPS" style="font-size:10px;padding:2px 8px;background:#e2e8f0;color:#475569;border:none;border-radius:4px;cursor:pointer">📷 复制(WPS格式)</button></div>'+
      arr.map(function(r){
        return'<div class="rlang-row" data-text="'+esc(r.text)+'" style="padding:6px 8px;cursor:pointer;border-radius:4px;margin-bottom:2px;background:#f8fafc">'+
          '<span class="rlang-tag">'+r.lang.toUpperCase()+'</span>'+
          '<span class="rlang-text" style="font-size:12px">'+esc(r.text)+'</span>'+
        '</div>';
      }).join('');
    // Click to send to WhatsApp
    results.querySelectorAll('.rlang-row').forEach(function(row){
      row.onclick=function(){sendToWhatsApp(this.dataset.text);showStatus(document.getElementById('rstatus'),'💬 已发送翻译',true);};
    });
    // WPS copy button — Arabic only, no labels
    var btnCopyWPS=document.getElementById('btnCopyWPS');
    if(btnCopyWPS)btnCopyWPS.onclick=function(){
      copyAsImage(arr[2].text, btnCopyWPS);
    };
  }catch(e){
    results.innerHTML='<div class="reply-empty">翻译失败: '+e.message+'</div>';
  }
}

// ===== Save translation as reply =====
function saveTranslationAsReply(){
  if(!lastTranslation){showStatus(document.getElementById('rstatus'),'请先翻译',false);return;}
  var code=document.getElementById('translateCode').value.trim();
  if(!code) code=String(repliesData.length+1).padStart(3,'0');
  // Check if code exists
  var found=null;
  for(var i=0;i<repliesData.length;i++){if(repliesData[i].code===code){found=repliesData[i];break;}}
  if(!found){found={code:code};repliesData.push(found);}
  found.en=lastTranslation.en;found.fr=lastTranslation.fr;found.ar=lastTranslation.ar;
  chrome.storage.local.set({replies:repliesData},function(){
    renderReplies();
    showStatus(document.getElementById('rstatus'),'✅ 话术 #'+code+' 已保存',true);
  });
}

// Remove old addReplyBtn handler (replaced by new saveTranslationAsReply)
document.getElementById('replySearch').oninput=renderReplies;
document.getElementById('btnTranslate').onclick=doTranslate;
document.getElementById('btnSaveAsReply').onclick=saveTranslationAsReply;
document.getElementById('translateInput').addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();doTranslate();}});

// =================== Send text to WhatsApp input ===================
function sendToWhatsApp(text){
  // Normalize: literal \n and ⏎ → real newline
  text = (text||'').replace(/\\n/g, String.fromCharCode(10)).replace(/⏎/g, String.fromCharCode(10));
  chrome.tabs.query({url:'*://web.whatsapp.com/*'},function(tabs){
    if(!tabs[0])return;
    chrome.scripting.executeScript({target:{tabId:tabs[0].id},func:function(t){
      // Find the message input box
      var box=document.querySelector('[contenteditable="true"][data-tab="10"]')||
              document.querySelector('div[contenteditable="true"][role="textbox"]')||
              document.querySelector('#main footer div[contenteditable="true"]');
      if(box){
        box.focus();
        var hasNewline = t.indexOf(String.fromCharCode(10)) >= 0;
        if(hasNewline){
          // Multi-line → copy to clipboard, user pastes with Cmd+V
          var ta = document.createElement('textarea');
          ta.value = t; ta.style.position = 'fixed'; ta.style.left = '-9999px';
          document.body.appendChild(ta); ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        } else {
          // Single line → direct insert
          document.execCommand('selectAll', false, null);
          document.execCommand('insertText', false, t);
        }
        box.dispatchEvent(new Event('input',{bubbles:true}));
      }
    },args:[text]});
  });
}

// =================== BOTTOM BAR ===================
// btnCard, btnFollowup, btnAddProduct handlers at bottom of file
// 💾 聊天记录 - 保存当前客户所有聊天到本地
document.getElementById('btnSaveChat').onclick=function(){
  if(!currentPhone){alert('请先获取客户信息');return;}
  // 仅A级客户可保存聊天
  var custData=cust[currentPhone];
  if(!custData||custData.level!=='A'){alert('仅A级客户可保存聊天记录');return;}
  chrome.tabs.query({url:'*://web.whatsapp.com/*'},function(tabs){
    if(!tabs.length){alert('请先打开WhatsApp Web');return;}
    chrome.scripting.executeScript({
      target:{tabId:tabs[0].id},world:'MAIN',
      func:function(){
        var msgs=document.querySelectorAll('div[data-id]');
        var items=[],saved={};
        msgs.forEach(function(m){
          var id=m.getAttribute('data-id');
          if(saved[id])return;saved[id]=true;
          var t=m.querySelector('.copyable-text,.selectable-text');
          var txt=t?t.textContent.trim():'';
          // 检测媒体
          var media=m.querySelector('img[src],video[src],[data-testid="image-thumb"]');
          var hasImg=!!m.querySelector('img[src^="blob:"],img[src^="data:"],[data-testid="image-thumb"]');
          var hasVid=!!m.querySelector('video');
          var hasDoc=!!m.querySelector('[data-testid="document-thumb"]');
          var sender=m.classList.contains('message-in')?'客户':'我';
          var content=txt;
          if(hasImg)content=(txt||'')+' [📷图片]';
          if(hasVid)content=(txt||'')+' [🎬视频]';
          if(hasDoc)content=(txt||'')+' [📎文件]';
          if(content)items.push({id:id,sender:sender,text:content,time:time});
        });
        return items;
      }
    }).then(function(r){
      var items=r[0].result||[];
      if(!items.length){alert('未找到聊天记录');return;}
      // 翻译非中文消息
      var isChinese=function(t){var cnt=0;for(var i=0;i<t.length;i++){var c=t.charCodeAt(i);if(c>=0x4E00&&c<=0x9FFF)cnt++;}return cnt>t.length*0.3;};
      var toTranslate=items.filter(function(x){return!isChinese(x.text);});
      var promises=toTranslate.map(function(x){
        var orig=x.text.replace(/\[📷🎬📎\].*$/,'').trim();
        if(!orig)return Promise.resolve({id:x.id,cn:''});
        return fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q='+encodeURIComponent(orig))
          .then(function(r){return r.json();})
          .then(function(d){return{id:x.id,cn:d[0]?d[0].map(function(s){return s[0];}).join(''):''};})
          .catch(function(){return{id:x.id,cn:''};});
      });
      Promise.all(promises).then(function(trans){
        var cnMap={};trans.forEach(function(x){if(x.cn)cnMap[x.id]=x.cn;});
        items.forEach(function(x){if(cnMap[x.id])x.cn=cnMap[x.id];});
        // 按日期分组保存
        var today=new Date().toISOString().slice(0,10);
        chrome.storage.local.get(['chat_history'],function(d){
          var hist=d.chat_history||{};
          if(!hist[currentPhone])hist[currentPhone]={};
          if(!hist[currentPhone][today])hist[currentPhone][today]=[];
          var existing={};
          hist[currentPhone][today].forEach(function(m){existing[m.id]=true;});
          var added=0;
          items.forEach(function(m){
            if(!existing[m.id]){hist[currentPhone][today].push(m);added++;}
          });
          chrome.storage.local.set({chat_history:hist},function(){
            var total=hist[currentPhone][today].length;
            var allDays=Object.keys(hist[currentPhone]).length;
            alert('✅ 已保存 '+added+' 条新消息\n📅 今天共 '+total+' 条\n📆 累计 '+allDays+' 天聊天记录');
          });
        });
      });
    }).catch(function(){alert('抓取失败');});
  });
};

// =================== INIT: load cached（不自动恢复卡片，避免覆盖当前数据）===================
chrome.storage.local.get(['wa_active_chat','customers'],function(d){
  var chat=d.wa_active_chat;if(!chat||!chat.phone)return;
  // 只恢复 currentPhone，不更新卡片显示
  currentPhone=chat.phone;
});

// Storage change listener
chrome.storage.onChanged.addListener(function(changes){
  if(changes.wa_active_chat&&changes.wa_active_chat.newValue){
    var chat=changes.wa_active_chat.newValue;
    if(chat.phone&&chat.phone!==currentPhone){
      currentPhone=chat.phone;
      chrome.storage.local.get(['customers'],function(d){
        var c=(d.customers||{})[chat.phone],country=chat.country||detectCountry(chat.phone);
        cname.textContent=chat.name||'';cphone.textContent=chat.phone;card.classList.add('show');
        if(c){cstatus.textContent='✅ 已登记 · ⭐ '+(c.level||'C')+'级';cstatus.className='cstatus registered';cstatus.style.display='inline-block';}
        else{cstatus.textContent='🆕 新客户';cstatus.className='cstatus new';cstatus.style.display='inline-block';}
        cmeta.textContent='🌍 '+country+' · ⭐ '+(c?c.level||'C':'C')+'级';
      });
    }
  }
});

// =================== TOOLS: Currency + Shipping by dims + Container + Timezones ===================

// Currency converter - 中国银行现汇买入价
var FX_RATE = 7.25; // fallback USD→CNY

function fetchFXRate(){
  fetch('https://www.boc.cn/sourcedb/whpj/index.html')
    .then(function(r){return r.text();})
    .then(function(html){
      // 正则匹配美元行，提取现汇买入价（第二个td，每100美元）
      var m = html.match(/<td[^>]*>\s*美元\s*<\/td>\s*<td[^>]*>\s*([\d.]+)\s*<\/td>/i);
      if(m && m[1]){
        FX_RATE = parseFloat(m[1]) / 100; // 每百美元 → 每美元
        document.getElementById('fxRate').textContent = '💵 中行现汇买入价: 1 USD = '+FX_RATE.toFixed(4)+' CNY';
        chrome.storage.local.set({fx_rate: FX_RATE, fx_updated: Date.now()});
      } else {
        throw new Error('BoC parse failed');
      }
    })
    .catch(function(){
      chrome.storage.local.get(['fx_rate'],function(d){
        if(d.fx_rate) FX_RATE = d.fx_rate;
        document.getElementById('fxRate').textContent = '💵 实时汇率: 1 USD ≈ '+FX_RATE.toFixed(2)+' CNY (缓存)';
      });
    });
}
fetchFXRate();

// Vehicle dimensions preset
var DIM_PRESETS = {
  '牵引车': {l:6.8,w:2.5,h:3.5}, '自卸车': {l:8.5,w:2.5,h:3.2},
  '搅拌车': {l:9.0,w:2.5,h:3.8}, '冷藏车': {l:9.5,w:2.5,h:3.8},
  '水罐车': {l:8.0,w:2.5,h:3.2}, '挖掘机20T': {l:9.5,w:3.0,h:3.2},
  '挖掘机35T': {l:11.2,w:3.2,h:3.5}
};
var dimTypeEl=document.getElementById('dimType');
if(dimTypeEl){
// Only run dim calcs if elements exist
dimTypeEl.onchange = function(){
  var d = DIM_PRESETS[this.value];
  if(d){document.getElementById('dimL').value=d.l;document.getElementById('dimW').value=d.w;document.getElementById('dimH').value=d.h;}
  calcDimShip();
};

// Port rates: $ per CBM (base for loose cargo / reference)
var PORT_RATES = {
  '阿尔及尔':65,'拉各斯':75,'蒙巴萨':65,'达曼':42,'杰贝阿里':38,'特马':70,'阿比让':70,'德班':55
};
// Fixed per-vehicle shipping (overrides CBM calc for known vehicle types)
var FIXED_SHIP = {
  '阿尔及尔':{牵引车:'$2,800-3,500',自卸车:'$3,200-4,000',搅拌车:'$3,000-3,800',冷藏车:'$3,200-4,000',水罐车:'$2,500-3,200',挖掘机20T:'$4,500-5,500',挖掘机35T:'$5,500-7,000'},
  '拉各斯':{牵引车:'$4,200-5,000',自卸车:'$4,500-5,500',搅拌车:'$4,300-5,200',冷藏车:'$4,500-5,500',水罐车:'$3,800-4,500',挖掘机20T:'$6,000-7,500',挖掘机35T:'$7,500-9,000'},
  '蒙巴萨':{牵引车:'$3,500-4,500',自卸车:'$3,800-4,800',搅拌车:'$3,600-4,500',冷藏车:'$3,800-4,800',水罐车:'$3,200-4,000',挖掘机20T:'$5,500-6,800',挖掘机35T:'$6,800-8,500'},
  '达曼':{牵引车:'$2,200-2,800',自卸车:'$2,500-3,200',搅拌车:'$2,400-3,000',冷藏车:'$2,500-3,200',水罐车:'$2,000-2,600',挖掘机20T:'$3,800-4,800',挖掘机35T:'$4,800-6,000'},
  '杰贝阿里':{牵引车:'$2,000-2,600',自卸车:'$2,300-3,000',搅拌车:'$2,200-2,800',冷藏车:'$2,300-3,000',水罐车:'$1,800-2,400',挖掘机20T:'$3,500-4,500',挖掘机35T:'$4,500-5,800'},
  '特马':{牵引车:'$3,800-4,800',自卸车:'$4,200-5,200',搅拌车:'$4,000-5,000',冷藏车:'$4,200-5,200',水罐车:'$3,500-4,200',挖掘机20T:'$5,800-7,000',挖掘机35T:'$7,000-9,000'},
  '阿比让':{牵引车:'$3,800-4,800',自卸车:'$4,200-5,200',搅拌车:'$4,000-5,000',冷藏车:'$4,200-5,200',水罐车:'$3,500-4,200',挖掘机20T:'$5,800-7,000',挖掘机35T:'$7,000-9,000'},
  '德班':{牵引车:'$3,000-4,000',自卸车:'$3,500-4,500',搅拌车:'$3,200-4,000',冷藏车:'$3,500-4,500',水罐车:'$2,800-3,500',挖掘机20T:'$5,000-6,500',挖掘机35T:'$6,500-8,000'},
};
['dimL','dimW','dimH','dimPort'].forEach(function(id){
  var el=document.getElementById(id);
  if(el){el.onchange=calcDimShip;el.oninput=calcDimShip;}
});
dimTypeEl.onchange = function(){
  var d = DIM_PRESETS[this.value];
  if(d){document.getElementById('dimL').value=d.l;document.getElementById('dimW').value=d.w;document.getElementById('dimH').value=d.h;}
  calcDimShip();
};

function calcDimShip(){
  var l = parseFloat(document.getElementById('dimL').value)||0;
  var w = parseFloat(document.getElementById('dimW').value)||0;
  var h = parseFloat(document.getElementById('dimH').value)||0;
  var port = document.getElementById('dimPort').value;
  var vtype = document.getElementById('dimType').value;
  var r = document.getElementById('dimResult');
  if(!l||!w||!h||!port){r.style.display='none';return;}
  var cbm = (l*w*h);
  var area = (l*w);
  r.style.display='block';
  document.getElementById('dimCBM').textContent = cbm.toFixed(1)+' m³';
  document.getElementById('dimArea').textContent = area.toFixed(1)+' m²';

  // Use fixed rate if vehicle type matches, else CBM-based
  var price='',note='';
  if(vtype&&vtype!=='custom'&&FIXED_SHIP[port]&&FIXED_SHIP[port][vtype]){
    price = FIXED_SHIP[port][vtype];
    note = '⚓ 参考整车运费 · '+port+' · 航程25-40天';
  }else{
    var rate = PORT_RATES[port]||60;
    var est = Math.round(cbm * rate);
    price = '$'+est.toLocaleString();
    note = '⚓ 按CBM估算('+rate+'/CBM) · '+cbm.toFixed(1)+' CBM · '+port+' · 实际以船公司为准';
  }
  document.getElementById('dimPrice').textContent = price;
  document.getElementById('dimNote').textContent = note;
}
var dimCopyEl=document.getElementById('dimCopy');
if(dimCopyEl)dimCopyEl.onclick = function(){
  var type = document.getElementById('dimType').value||'车辆';
  var port = document.getElementById('dimPort').value;
  var cbm = document.getElementById('dimCBM').textContent;
  var price = document.getElementById('dimPrice').textContent;
  var l=document.getElementById('dimL').value,w=document.getElementById('dimW').value,h=document.getElementById('dimH').value;
  var txt = '🚢 '+type+' 海运到 '+port+'\n📐 尺寸: '+l+'×'+w+'×'+h+'m | '+cbm+'\n💰 预估运费: '+price+'\n⚠️ 实际价格以船公司为准';
  sendToWhatsApp(txt);
  showStatus(document.getElementById('tstatus'),'📋 已填入',true);
};
} // end if(dimTypeEl)

// Remove old ship calc references (no longer used)
// shipCountry/shipType/shipResult/shipCopy elements no longer exist

// Timezone offsets
var TZ = {
  '阿尔及尔': 1, '拉各斯': 1, '蒙巴萨': 3, '达曼': 3, '杰贝阿里': 4, '特马': 0, '阿比让': 0, '德班': 2
};

// Shipping rates: 国家→车型→价格范围 (USD)
var SHIPPING = {
  '阿尔及利亚':{牵引车:'$2,800-3,500',自卸车:'$3,200-4,000',搅拌车:'$3,000-3,800',冷藏车:'$3,200-4,000',水罐车:'$2,500-3,200',挖掘机:'$4,500-5,500'},
  '尼日利亚':{牵引车:'$4,200-5,000',自卸车:'$4,500-5,500',搅拌车:'$4,300-5,200',冷藏车:'$4,500-5,500',水罐车:'$3,800-4,500',挖掘机:'$6,000-7,500'},
  '肯尼亚':{牵引车:'$3,500-4,500',自卸车:'$3,800-4,800',搅拌车:'$3,600-4,500',冷藏车:'$3,800-4,800',水罐车:'$3,200-4,000',挖掘机:'$5,500-6,800'},
  '沙特':{牵引车:'$2,200-2,800',自卸车:'$2,500-3,200',搅拌车:'$2,400-3,000',冷藏车:'$2,500-3,200',水罐车:'$2,000-2,600',挖掘机:'$3,800-4,800'},
  '阿联酋':{牵引车:'$2,000-2,600',自卸车:'$2,300-3,000',搅拌车:'$2,200-2,800',冷藏车:'$2,300-3,000',水罐车:'$1,800-2,400',挖掘机:'$3,500-4,500'},
  '加纳':{牵引车:'$3,800-4,800',自卸车:'$4,200-5,200',搅拌车:'$4,000-5,000',冷藏车:'$4,200-5,200',水罐车:'$3,500-4,200',挖掘机:'$5,800-7,000'},
  '科特迪瓦':{牵引车:'$3,800-4,800',自卸车:'$4,200-5,200',搅拌车:'$4,000-5,000',冷藏车:'$4,200-5,200',水罐车:'$3,500-4,200',挖掘机:'$5,800-7,000'},
  '南非':{牵引车:'$3,000-4,000',自卸车:'$3,500-4,500',搅拌车:'$3,200-4,000',冷藏车:'$3,500-4,500',水罐车:'$2,800-3,500',挖掘机:'$5,000-6,500'},
};

// Container sizes: 20GP 5.90x2.35x2.39m, 40HQ 12.03x2.35x2.69m
var VEHICLE_DIMS = {
  '牵引车':{l:6.8,w:2.5,h:3.5, name:'牵引车'},
  '自卸车':{l:8.5,w:2.5,h:3.2, name:'自卸车'},
  '搅拌车':{l:9.0,w:2.5,h:3.8, name:'搅拌车'},
  '冷藏车':{l:9.5,w:2.5,h:3.8, name:'冷藏车'},
  '水罐车':{l:8.0,w:2.5,h:3.2, name:'水罐车'},
  '挖掘机215':{l:9.5,w:3.0,h:3.2, name:'挖掘机 21.5T'},
  '挖掘机335':{l:11.2,w:3.2,h:3.5, name:'挖掘机 33.5T'},
};

// Update timezone display every 60s
function updateTimezones(){
  var now=new Date();
  ['DZ','NG','SA'].forEach(function(id){
    var data={DZ:{name:'阿尔及利亚',tz:1,flag:'🇩🇿'},NG:{name:'坦桑尼亚',tz:3,flag:'🇹🇿'},SA:{name:'沙特',tz:3,flag:'🇸🇦'}}[id];
    var t = new Date(now.getTime() + data.tz * 3600000);
    var h=t.getUTCHours().toString().padStart(2,'0'),m=t.getUTCMinutes().toString().padStart(2,'0');
    document.getElementById('tz'+id).textContent=data.flag+' '+data.name+' '+h+':'+m;
  });
}
setInterval(updateTimezones,60000);
updateTimezones();

// Shipping calculator (if elements exist)
var shipCountryEl=document.getElementById('shipCountry');
var shipTypeEl=document.getElementById('shipType');
if(shipCountryEl)shipCountryEl.onchange=calcShip;
if(shipTypeEl)shipTypeEl.onchange=calcShip;
function calcShip(){
  var cEl=document.getElementById('shipCountry');
  var tEl=document.getElementById('shipType');
  var r=document.getElementById('shipResult');
  if(!cEl||!tEl||!r)return;
  var country=cEl.value,type=tEl.value;
  if(!country||!type){r.style.display='none';return;}
  var rate=SHIPPING[country]&&SHIPPING[country][type];
  if(!rate){r.style.display='none';return;}
  var tz=TZ[country];
  r.style.display='block';
  var spEl=document.getElementById('shipPrice');
  var snEl=document.getElementById('shipNote');
  if(spEl)spEl.textContent=rate;
  if(snEl)snEl.textContent='🚢 起运港天津/上海 → '+tz.port+' · 航程约25-40天 · 实际价格以船公司为准';
}
var shipCopyEl=document.getElementById('shipCopy');
if(shipCopyEl)shipCopyEl.onclick=function(){
  var c=document.getElementById('shipCountry').value,t=document.getElementById('shipType').value;
  var rate=SHIPPING[c]&&SHIPPING[c][t],tz=TZ[c];
  if(!rate)return;
  var txt='🚢 '+t+' 海运到 '+c+'('+tz.port+')\n💰 预估运费: '+rate+'\n📅 航程约25-40天\n⚠️ 实际价格以船公司为准';
  sendToWhatsApp(txt);
  showStatus(document.getElementById('tstatus'),'📋 海运费已填入',true);
};

// Container calculator (element removed, safe)
var boxTypeEl=document.getElementById('boxType');
if(boxTypeEl)boxTypeEl.onchange=function(){
  var type=this.value,d=VEHICLE_DIMS[type];
  var r=document.getElementById('boxResult');
  if(!d){r.style.display='none';return;}
  r.style.display='block';
  var gp40=Math.floor(12.03/d.l); // How many fit length-wise in 40HQ
  var wFit=Math.floor(2.35/d.w); // Width fit
  var total40=gp40*wFit;
  var gp20=Math.floor(5.90/d.l); total40=total40||1;

  var detail='<b>'+d.name+'</b> 尺寸: '+d.l+'m × '+d.w+'m × '+d.h+'m<br><br>';
  if(type.indexOf('挖掘机')>=0){
    detail+='🔸 <b>40HQ 平架/低平板:</b> 1台挖掘机<br>';
    detail+='🔸 <b>散货船:</b> 推荐滚装或散货船运输<br>';
    detail+='🔸 <b>单车重量:</b> '+(type==='挖掘机215'?'21.5T':'33.5T')+'<br>';
    detail+='<span style="color:#94a3b8">⚠️ 挖掘机通常不用集装箱，使用低平板或散货船</span>';
  }else{
    detail+='🔸 <b>40HQ:</b> 可装 <b style="color:#059669">'+total40+'</b> 台 (拆解后视镜/排气管)<br>';
    detail+='🔸 <b>20GP:</b> 可装 <b style="color:#059669">1</b> 台<br>';
    detail+='🔸 <b>每车占:</b> 约 '+(Math.ceil(d.l*d.w*10)/10)+'m² 甲板面积<br>';
    if(total40>1)detail+='🔸 <b>推荐:</b> '+d.name+'40HQ装'+total40+'台最经济';
    else detail+='🔸 <b>推荐:</b> 使用框架箱(Flat Rack)或散货船';
  }
  document.getElementById('boxDetail').innerHTML=detail;
};

// Quote calculator
var QC_FACTORY = {
  '牵引车420':{price:220000,name:'HOWO 420hp 牵引车'},'牵引车371':{price:195000,name:'HOWO 371hp 牵引车'},
  '自卸车371':{price:240000,name:'HOWO 371hp 自卸车'},'搅拌车8':{price:200000,name:'HOWO 8m³ 搅拌车'},
  '冷藏车':{price:190000,name:'HOWO 6x2 冷藏车'},'水罐车':{price:130000,name:'10m³ 水罐车'},
  '挖掘机215':{price:350000,name:'XCMG XE215C 挖掘机'},'挖掘机335':{price:520000,name:'XCMG XE335C 挖掘机'}
};
// Quote calculator (已被CFR计算器取代，元素删除后安全跳过)
var qcTypeEl=document.getElementById('qcType');
if(qcTypeEl){
qcTypeEl.onchange = function(){
  var d = QC_FACTORY[this.value];
  if(d) document.getElementById('qcFactory').value = d.price;
  calcQuote();
};
['qcFactory','qcProfit','qcShipping'].forEach(function(id){
  document.getElementById(id).oninput = calcQuote;
  document.getElementById(id).onchange = calcQuote;
});
// Init rate from FX
setTimeout(function(){
  if(!document.getElementById('qcRate').value) document.getElementById('qcRate').value = FX_RATE.toFixed(2);
}, 1000);

function calcQuote(){
  var factory = parseFloat(document.getElementById('qcFactory').value)||0;
  var rate = parseFloat(document.getElementById('qcRate').value)||FX_RATE;
  var profit = parseFloat(document.getElementById('qcProfit').value)||1500;
  var shipAdd = parseFloat(document.getElementById('qcShipping').value)||500;
  var r = document.getElementById('qcResult');
  if(!factory||!rate){r.style.display='none';return;}
  var cost = factory / rate;
  var fob = cost + profit;
  var final = fob + shipAdd;
  document.getElementById('qcCost').value = '$'+cost.toFixed(0);
  document.getElementById('qcCost2').textContent = '$'+cost.toFixed(0);
  document.getElementById('qcFOB').textContent = '$'+fob.toFixed(0);
  document.getElementById('qcFinal').textContent = '$'+final.toFixed(0);
  var vtype=document.getElementById('qcType').value;
  var vname=QC_FACTORY[vtype]?QC_FACTORY[vtype].name:'车辆';
  document.getElementById('qcNote').textContent = vname+' · 成本 ¥'+factory.toLocaleString()+' ÷ '+rate+' = $'+cost.toFixed(0)+' + 利润$'+profit+' + 海运$'+shipAdd;
  r.style.display='block';
}
document.getElementById('qcCopy').onclick = function(){
  var vtype=document.getElementById('qcType').value,vname=QC_FACTORY[vtype]?QC_FACTORY[vtype].name:'车辆';
  var factory=document.getElementById('qcFactory').value,rate=document.getElementById('qcRate').value;
  var cost=document.getElementById('qcCost2').textContent,fob=document.getElementById('qcFOB').textContent,final=document.getElementById('qcFinal').textContent;
  var txt='📦 '+vname+'\n💰 FOB 价格: '+fob+'\n🚢 含运费报价: '+final+'\n📅 交货期: 30-45天\n⚠️ 以上价格基于汇率 '+rate+', 以最终PI为准';
  sendToWhatsApp(txt);
  showStatus(document.getElementById('tstatus'),'📋 报价已填入',true);
};
} // end if(qcTypeEl)

// Init tools when tab opens
function initTools(){updateTimezones();checkPendingOrders();}

// ========== ADMIN: 待处理订单提醒 ==========
function checkPendingOrders(){
  if(!isAdmin())return;
  chrome.storage.local.get(['customers'],function(d){
    var contacts=Object.values(d.customers||{});
    var pending=contacts.filter(function(c){return c.hasConfirmedOrder;});
    var alertEl=document.getElementById('adminAlert');
    var countEl=document.getElementById('alertCount');
    if(alertEl&&countEl){
      countEl.textContent=pending.length;
      alertEl.style.display=pending.length>0?'block':'none';
    }
  });
  setTimeout(checkPendingOrders,60000);
}
document.getElementById('btnDismissAlert').onclick=function(){
  document.getElementById('adminAlert').style.display='none';
  // 10分钟后再次提醒
  setTimeout(function(){
    var el=document.getElementById('adminAlert');
    if(el&&parseInt(document.getElementById('alertCount').textContent)>0)el.style.display='block';
  },600000);
};

// ========== 全局搜索（API）==========
document.getElementById('btnGlobalSearch').onclick=function(){
  var q=document.getElementById('searchInput').value.replace(/\s+/g,'').toLowerCase();
  console.log('[CRM] 搜索:',q);
  if(!q){return;}
  var results=document.getElementById('searchResults');
  results.style.display='block';results.innerHTML='<div style="color:#94a3b8;font-size:11px;padding:8px;text-align:center">🔍 搜索中...</div>';
  // 优先本地快速查，失败则走API
  var foundLocal=false;
  chrome.storage.local.get(['customers'],function(d){
    var custs=d.customers||{},found=[];
    if(Object.keys(custs).length>100){
      Object.keys(custs).forEach(function(ph){
        var c=custs[ph],match=false;
        if((c.name||'').toLowerCase().indexOf(q)>=0||ph.toLowerCase().indexOf(q)>=0)match=true;
        // 权限过滤：员工只能搜自己客户
        if(match&&!isAdmin()&&c.assignedTo&&c.assignedTo!==currentUser.phone)match=false;
        if(!match&&c.orders){
          c.orders.forEach(function(o){
            if(!o)return;
            var fields=[o.vessel,o.bl_no,o.lc_hsbc_no,o.lc_no,o.contract_no,o.order_no,o.pi_no];
            for(var i=0;i<fields.length;i++){if((fields[i]||'').toLowerCase().indexOf(q)>=0){match=true;break;}}
          });
        }
        if(match)found.push(c);
      });
    }
    if(found.length>0){
      foundLocal=true;
      renderSearchResults(results,found);
    }else{
      // API搜索
      fetch(CRM_API+'?search='+encodeURIComponent(q))
        .then(function(r){return r.json();})
        .then(function(data){
          var contacts=(data.contacts||[]);
          renderSearchResults(results,contacts);
        })
        .catch(function(e){
          results.innerHTML='<div style="color:#dc2626;font-size:11px;padding:8px;text-align:center">❌ 搜索失败: '+e.message+'</div>';
        });
    }
  });
};

function renderSearchResults(results, found){
  if(!found.length){results.innerHTML='<div style="color:#94a3b8;font-size:11px;padding:8px;text-align:center">未找到匹配</div>';return;}
  var html='';
  found.forEach(function(c){
    var ordersHtml='';
    if(c.orders&&c.orders.length){
      ordersHtml='<div style="font-size:10px;color:#94a3b8;margin-top:2px">'+
        c.orders.map(function(o){return '📦 '+(o.product||'')+(o.pi_no?' · PI:'+o.pi_no:'')+(o.vessel?' · 🚢'+o.vessel:'');}).join('<br>')+'</div>';
    }
    html+='<div class="search-result-item" data-phone="'+(c.phone||'').replace(/"/g,'&quot;')+'" style="cursor:pointer;padding:8px;border-radius:6px;margin-bottom:4px;background:#fff;border:1px solid #e2e8f0;font-size:12px">'+
      '<div style="font-weight:600;color:#1e293b">'+(c.name||c.phone)+' ⭐ '+(c.level||'C')+'级</div>'+
      '<div style="color:#64748b;font-size:10px">🌍 '+(c.country||'')+' · 📞 '+c.phone+'</div>'+ordersHtml+
    '</div>';
  });
  results.innerHTML=html+(found.length>20?'<div style="color:#94a3b8;font-size:10px;text-align:center;padding:4px">显示前 20 条，共 '+found.length+' 条</div>':'');
}

// 从搜索结果打开客户
window.openCustomer=function(phone){
  console.log('[CRM] openCustomer:',phone);
  currentPhone=phone;
  document.getElementById('searchResults').style.display='none';
  document.getElementById('searchInput').value='';
  function fillForm(c){
    if(!c)return;
    cname.textContent=c.name||phone;cphone.textContent=phone;
    cmeta.textContent='🌍 '+(c.country||'')+' · 📅 '+(c.firstSeen?new Date(c.firstSeen).toLocaleDateString('zh-CN'):'');
    cstatus.textContent='✅ 已登记 · ⭐ '+(c.level||'C')+'级';
    cstatus.className='cstatus registered';cstatus.style.display='inline-block';
    card.classList.add('show');
    document.getElementById('fname').value=c.name||'';
    document.getElementById('fphone').value=phone;
    document.getElementById('fcountry').value=c.country||'';
    document.getElementById('flevel').value=c.level||'C';
    
    document.getElementById('fcompany').value=c.company||'';
    document.getElementById('femail').value=c.email||'';
    document.getElementById('fnotes').value=c.notes||'';
    var container=document.getElementById('ordersContainer');
    while(container.firstChild)container.removeChild(container.firstChild);
    orderCount=0;
    var aOrders=c.orders||[];
    if(!aOrders.length)aOrders.push({});
    aOrders.forEach(function(o){orderCount++;var n=orderCount;createOrderBlock(n,o);setTimeout(function(){showFilesList(phone,n,'pi');showFilesList(phone,n,'pur_contract');showFilesList(phone,n,'contract');showFilesList(phone,n,'delivery');},100);});
  }
  chrome.storage.local.get(['customers'],function(d){
    var c=(d.customers||{})[phone];
    if(c){fillForm(c);return;}
    // 本地没有，调API
    fetch(CRM_API+'?phone='+encodeURIComponent(phone))
      .then(function(r){return r.json();})
      .then(function(data){
        var ct=data.contact||null;
        if(ct){fillForm(ct);showStatus(status,'✅ 已加载 ('+phone+')',true);}
        else{showStatus(status,'未找到客户',false);}
      })
      .catch(function(){showStatus(status,'加载失败',false);});
  });
};

// ========== 今日回访提醒 ==========
function checkFollowups(){
  var today=new Date().toISOString().slice(0,10);
  chrome.storage.local.get(['customers'],function(d){
    var custs=d.customers||{},due=[];
    Object.keys(custs).forEach(function(ph){
      var c=custs[ph];
      if(!c.nextFollowUp)return;
      var followDate=c.nextFollowUp.slice(0,10);
      if(followDate<=today)due.push(c);
    });
    var bar=document.getElementById('followupBar');
    var count=document.getElementById('followupCount');
    if(!bar||!count)return;
    if(due.length>0){
      bar.style.display='block';
      count.textContent=due.length;
      count.style.color='#dc2626';
      count.style.fontWeight='700';
    }else{
      bar.style.display='none';
    }
    // 预加载列表
    var html=due.map(function(c){
      return '<div class="followup-item" data-phone="'+c.phone.replace(/"/g,'&quot;')+'" style="cursor:pointer;padding:6px 8px;border-radius:4px;margin-bottom:2px;font-size:11px;border-bottom:1px solid #fef3c7">'+
        '<span style="font-weight:600;color:#1e293b">'+(c.name||c.phone)+'</span>'+
        '<span style="margin-left:6px;color:#64748b">⭐ '+(c.level||'C')+'级</span>'+
        '<span style="float:right;color:#dc2626;font-size:10px">'+new Date(c.nextFollowUp).toLocaleDateString('zh-CN')+'</span>'+
      '</div>';
    }).join('');
    var fl=document.getElementById('followupList');
    if(fl)fl.innerHTML=html;
  });
}
// 展开/折叠（已移至弹窗模式，按钮不再存在）
var btnTF=document.getElementById('btnToggleFollowups');
if(btnTF)btnTF.onclick=function(){
  var list=document.getElementById('followupList');
  var btn=document.getElementById('btnToggleFollowups');
  if(list&&list.style.display==='none'){list.style.display='block';btn.textContent='收起 ▲';}
  else if(list){list.style.display='none';btn.textContent='展开 ▼';}
};
// 点击回访列表中的客户（已移至弹窗模式）
var fl2=document.getElementById('followupList');
if(fl2)fl2.addEventListener('click',function(e){
  var item=e.target.closest('.followup-item');
  if(!item)return;
  var phone=item.getAttribute('data-phone');
  if(phone)openCustomer(phone);
});
// 启动时检查，每小时刷新
if(isLoggedIn)checkFollowups();
if(isLoggedIn)setInterval(checkFollowups,3600000);

// ========== 图片复制工具 ==========
// 预加载缓存
var imageCache={};
function copyAsImage(text,btn){
  console.log('[CRM] copyAsImage called, text:',text.substring(0,30));
  // 第一次点击：加载图片
  if(!imageCache[text]){
    btn.textContent='⏳ 加载中...';
    var canvas=document.createElement('canvas');
    var ctx=canvas.getContext('2d');
    var dpr=window.devicePixelRatio||1;
    var dw=14446,dh=960,fs=700;
    canvas.width=dw*dpr;canvas.height=dh*dpr;
    ctx.scale(dpr,dpr);
    ctx.clearRect(0,0,dw,dh);
    ctx.fillStyle='#000';ctx.textAlign='left';ctx.textBaseline='middle';
    ctx.font=fs+'px SimSun,宋体,serif';
    ctx.fillText(text,60,dh/2);
    canvas.toBlob(function(blob){
      imageCache[text]=blob;
      btn.textContent='🟢 就绪';
      btn.style.borderColor='#34d399';btn.style.color='#34d399';
    },'image/png');
    return;
  }
  // 第二次点击：复制
  var blob=imageCache[text];
  navigator.clipboard.write([new ClipboardItem({'image/png':blob})]).then(function(){
    btn.textContent='✅ 已复制';
    btn.style.borderColor='#34d399';btn.style.color='#34d399';
    setTimeout(function(){btn.textContent='📷 复制(WPS格式)';btn.style.borderColor='#059669';btn.style.color='#059669';delete imageCache[text];},2000);
  }).catch(function(e){
    console.log('[CRM] Clipboard write failed:',e);
    btn.textContent='❌ 失败';
    setTimeout(function(){btn.textContent='📷 复制(WPS格式)';btn.style.borderColor='#059669';btn.style.color='#059669';delete imageCache[text];},2000);
  });
}

function showTranslationPanel(originals,translated){
  var panel=document.getElementById('translateResults');
  if(!panel)return;
  var html='<div style="max-height:400px;overflow:auto">';
  for(var i=0;i<translated.length;i++){
    var t=translated[i].replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g,'');
    var safe=t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    html+='<div style="margin:4px 0;padding:4px 6px;background:#f0fdf4;border-radius:4px;font-size:11px;display:flex;justify-content:space-between;align-items:center">';
    html+='<span style="flex:1;color:#065f46">'+safe+'</span>';
    html+='<button data-idx="'+i+'" class="btn-copy-img" style="margin-left:6px;padding:2px 6px;font-size:10px;border:1px solid #059669;background:#fff;color:#059669;border-radius:3px;cursor:pointer;white-space:nowrap">📷 复制</button>';
    html+='</div>';
  }
  html+='</div>';
  panel.innerHTML=html;
  // Store texts for lookup
  panel._texts=translated.map(function(t){return t.replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g,'');});
  // Bind copy buttons
  console.log('[CRM] Binding',document.querySelectorAll('.btn-copy-img').length,'copy buttons');
  document.querySelectorAll('.btn-copy-img').forEach(function(btn){
    btn.onclick=function(){
      var idx=parseInt(this.dataset.idx);
      copyAsImage(panel._texts[idx],this);
    };
  });
}
document.getElementById('btnTranslateChat').onclick=function(){trackActivity('translate');
  var btn=this;btn.textContent='⏳ 翻译中...';btn.disabled=true;
  chrome.tabs.query({url:'*://web.whatsapp.com/*'},function(tabs){
    if(!tabs.length){btn.textContent='🌐 一键翻译';btn.disabled=false;alert('请先打开WhatsApp Web');return;}
    // 先清旧翻译
    chrome.scripting.executeScript({
      target:{tabId:tabs[0].id},world:'MAIN',
      func:function(){document.querySelectorAll('.crm-translation').forEach(function(el){el.remove();});}
    });
    // 1. 抓取消息
    chrome.scripting.executeScript({
      target:{tabId:tabs[0].id},world:'MAIN',
      func:function(){
        var msgs=document.querySelectorAll('div[data-id]');
        var items=[];
        msgs.forEach(function(m){
          var t=m.querySelector('.copyable-text,.selectable-text');
          if(!t)return;
          var txt=t.textContent.trim();
          if(txt.length>1)items.push({id:m.getAttribute('data-id'),txt:txt});
        });
        return items.slice(-50);
      }
    }).then(function(r){
      var items=r[0].result||[];
      if(!items.length){alert('未找到聊天记录');return;}
      // 2. 逐条翻译，跳过中文
      var isChinese=function(t){var cnt=0;for(var i=0;i<t.length;i++){var c=t.charCodeAt(i);if(c>=0x4E00&&c<=0x9FFF)cnt++;}return cnt>t.length*0.3;};
      var promises=items.map(function(item,i){
        if(isChinese(item.txt))return Promise.resolve({idx:i,text:item.txt});
        return fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q='+encodeURIComponent(item.txt))
          .then(function(r){return r.json();})
          .then(function(d){return{idx:i,text:d[0]?d[0].map(function(s){return s[0];}).join(''):item.txt};})
          .catch(function(){return{idx:i,text:item.txt};});
      });
      Promise.all(promises).then(function(results){
        var translated=results.sort(function(a,b){return a.idx-b.idx;}).map(function(r){return r.text;});
        btn.textContent='🌐 一键翻译';btn.disabled=false;
        // 3. 注入译文到WhatsApp
        var transMap={};
        items.forEach(function(item,i){transMap[item.id]=translated[i]||'...';});
          chrome.scripting.executeScript({
            target:{tabId:tabs[0].id},world:'MAIN',
            func:function(map){
              document.querySelectorAll('div[data-id]').forEach(function(m){
                var id=m.getAttribute('data-id');
                if(!map[id])return;
                // 找到消息气泡（copyable-text的父级）
                var bubble=m.querySelector('.copyable-text,.selectable-text');
                if(!bubble)return;
                bubble=bubble.parentElement;
                var div=document.createElement('div');
                div.className='crm-translation';
                div.setAttribute('dir','ltr');
                var txt=map[id].replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g,'');
                div.textContent='📋 点击复制: 🌐 '+txt;
                div.style='padding:2px 0;font-size:12px;color:#059669;border-top:1px dashed #d1fae5;margin-top:4px;opacity:0.9;text-align:left;direction:ltr;unicode-bidi:embed';
                div.textContent='🌐 '+txt;
                bubble.appendChild(div);
              });
            },
            args:[transMap]
          }).then(function(){btn.textContent='🌐 一键翻译';btn.disabled=false;});
        }).catch(function(){btn.textContent='🌐 一键翻译';btn.disabled=false;alert('翻译失败，请检查网络');});
    }).catch(function(){btn.textContent='🌐 一键翻译';btn.disabled=false;alert('抓取失败');});
  });
};



// 🔔 客户回访 - 弹窗模式
document.getElementById('btnFollowup').onclick=function(){
  var modal=document.getElementById('followupModal');
  var list=document.getElementById('modalList');
  var today=new Date().toISOString().slice(0,10);
  list.innerHTML='<div style="color:#94a3b8;font-size:11px;padding:16px;text-align:center">⏳ 加载中...</div>';
  modal.style.display='block';
  chrome.storage.local.get(['customers','daily_activity'],function(d){
    var custs=d.customers||{},act=(d.daily_activity||{})[today]||{},sentTo=act.sentTo||[],due=[];
    Object.keys(custs).forEach(function(ph){
      var c=custs[ph];
      if(c.nextFollowUp&&c.nextFollowUp.slice(0,10)<=today){if(isAdmin()||!c.assignedTo||c.assignedTo===currentUser.phone)due.push(c);}
    });
    document.getElementById('modalCount').textContent=due.length;
    if(!due.length){list.innerHTML='<div style="color:#059669;font-size:13px;padding:30px;text-align:center">✅ 今日无待回访客户</div>';return;}
    list.innerHTML=due.map(function(c){
      var phoneClean=(c.phone||'').replace(/[^\d]/g,'');
      var done=sentTo.indexOf(phoneClean)>=0;
      return '<div class="followup-modal-item" data-phone="'+(c.phone||'').replace(/"/g,'&quot;')+'" style="cursor:pointer;padding:10px 14px;border-bottom:1px solid #f1f5f9;transition:background .1s'+(done?';opacity:0.5;background:#f0fdf4':'')+'">'+
        '<div style="font-weight:600;color:#1e293b;font-size:12px">'+(c.name||c.phone)+' <span style="color:#64748b;font-size:10px">⭐ '+(c.level||'C')+'级</span>'+(done?' <span style="color:#059669;font-size:9px">✅ 已回访</span>':'')+'</div>'+
        '<div style="color:#64748b;font-size:10px;margin-top:2px">🌍 '+(c.country||'')+' · 📞 '+c.phone+' · 🔔 '+new Date(c.nextFollowUp).toLocaleDateString('zh-CN')+'</div>'+
      '</div>';
    }).join('');
  });
};
// 关闭弹窗（延迟绑定，DOM可能未就绪）
setTimeout(function(){
  var closeBtn=document.getElementById('btnCloseModal');
  if(closeBtn)closeBtn.onclick=function(){
    document.getElementById('followupModal').style.display='none';
  };
},500);
// 双击回访客户 → 复制手机号
setTimeout(function(){
  var ml=document.getElementById('modalList');
  if(ml)ml.addEventListener('dblclick',function(e){
    var item=e.target.closest('.followup-modal-item');
    if(!item)return;
    var phone=item.getAttribute('data-phone');
    console.log('[CRM] 双击回访客户，复制手机号:',phone);
    if(phone){
      var clean=phone.replace(/[^\d]/g,'');
      navigator.clipboard.writeText(clean).then(function(){
        showStatus(document.getElementById('rstatus'),'📋 已复制: '+clean+' (请到WhatsApp搜索并发送消息)',true);
        // 视觉反馈：变灰标记
        item.style.opacity='0.5';
        item.style.background='#f0fdf4';
        setTimeout(function(){item.style.opacity='1';item.style.background='';},3000);
      });
    }
  });
},500);

// 双击跳转WhatsApp（使用WPP直接打开聊天，不刷新页面）
window.jumpToWhatsApp=function(phone){
  console.log('[CRM] jumpToWhatsApp:',phone);
  var clean=phone.replace(/[^\d]/g,'');
  chrome.tabs.query({url:'https://web.whatsapp.com/*'},function(tabs){
    console.log('[CRM] WhatsApp tabs:',tabs.length);
    if(tabs.length>0){
      chrome.tabs.update(tabs[0].id,{active:true},function(){
        // 通过WPP在WA Web内部切换聊天，不刷新页面
        chrome.scripting.executeScript({
          target:{tabId:tabs[0].id},world:'MAIN',
          func:function(phoneDigits){
            if(window.WPP&&WPP.chat&&WPP.chat.openChatBottom){
              WPP.chat.openChatBottom(phoneDigits+'@c.us');
              return'ok';
            }
            return'no-wpp';
          },
          args:[clean]
        }).catch(function(e){console.log('[CRM] err:',e);});
      });
    }
  });
};

// ➕ 产品添加 - 弹窗模式
document.getElementById('btnAddProduct').onclick=function(){
  document.getElementById('productModal').style.display='block';
  // Pre-fill country from current search context
  var addC=document.getElementById('addCountry');
  var curCountry=(document.getElementById('countryInput')&&document.getElementById('countryInput').value.trim())||selectedCountry||'';
  addC.value=curCountry;
  // 填充品牌下拉
  var brandSel=document.getElementById('addBrand');
  brandSel.innerHTML='<option value="">选择品牌</option>';
  Object.keys(CATEGORIES_BY_BRAND).forEach(function(b){
    brandSel.innerHTML+='<option value="'+b+'">'+b+'</option>';
  });
  // 品牌变化时更新车型
  brandSel.onchange=function(){
    var catSel=document.getElementById('addCat');
    var cats=CATEGORIES_BY_BRAND[this.value]||[];
    catSel.innerHTML='<option value="">选择车型</option>';
    cats.forEach(function(c){catSel.innerHTML+='<option value="'+c+'">'+c+'</option>';});
  };
  // 驱动下拉
  var driveSel=document.getElementById('addDrive');
  driveSel.innerHTML='<option value="">选择驱动</option>';
  ['4×2','6×2','6×4','8×2','8×4','4×4','10×4'].forEach(function(d){
    driveSel.innerHTML+='<option value="'+d+'">'+d+'</option>';
  });
};
// 关闭产品弹窗
setTimeout(function(){
  var cb=document.getElementById('btnCloseProductModal');
  if(cb)cb.onclick=function(){document.getElementById('productModal').style.display='none';};
},500);

// 保存产品到服务器（延迟绑定，弹窗元素后加载）
setTimeout(function(){
  var bsp=document.getElementById('btnSaveProduct');
  if(!bsp)return;
  bsp.onclick=function(){
  var pstatus=document.getElementById('addpStatus');
  var country=document.getElementById('addCountry').value.trim();
  var brand=document.getElementById('addBrand').value.trim();
  var cat=document.getElementById('addCat').value.trim();
  var drive=document.getElementById('addDrive').value.trim();
  var name=document.getElementById('addName').value.trim();
  var fob=document.getElementById('addFob').value;
  var shipping=document.getElementById('addShipping').value;
  var cfr=document.getElementById('addCfr').value;
  var engine=document.getElementById('addEngine').value.trim();
  if(!country||!name){pstatus.textContent='❌ 国家和型号名称必填';pstatus.className='status show err';return;}
  if(!fob||parseFloat(fob)<=0){pstatus.textContent='❌ FOB价格必填且必须大于0';pstatus.className='status show err';return;}

  pstatus.textContent='⏳ 保存中...';pstatus.className='status show ok';
  fetch(PRODUCTS_API,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      country:country,brand:brand||'默认',category:cat||'未分类',
      drive:drive||'-',product:{name:name,engine:engine||'',fob:fob||'0',shipping:shipping||'0',cfr:cfr||'0'}
    })
  })
  .then(function(r){return r.json();})
  .then(function(data){
    if(data.success){
      // 更新本地缓存
      chrome.storage.local.set({products:data.products});
      chrome.storage.local.set({products:data.products});
      pstatus.textContent='✅ 已保存到服务器，所有同事同步';
      // 清空表单
      document.getElementById('addName').value='';
      document.getElementById('addFob').value='';document.getElementById('addShipping').value='';document.getElementById('addCfr').value='';
      document.getElementById('addEngine').value='';
    }else{
      pstatus.textContent='❌ 保存失败: '+(data.error||'');
    }
    pstatus.className='status show '+(data.success?'ok':'err');
    setTimeout(function(){pstatus.className='status';},3000);
  })
  .catch(function(e){
    pstatus.textContent='❌ 网络错误';
    pstatus.className='status show err';
  });
};
},500);

// 清除所有客户数据（在 Console 运行: clearCRM()）
window.clearCRM=function(){
  chrome.storage.local.remove(['customers','contact_map','conversations','wa_active_chat','pi_records','doc_records'],function(){
    console.log('✅ 所有客户数据已清除，请刷新 WhatsApp Web');
  });
};


// 测试用: 随机设置N个客户今天需回访 (Console: testFollowups(8))
window.testFollowups=function(n){
  if(n===undefined)n=8;
  if(n===0){
    // 清除所有回访标记
    chrome.storage.local.get(['customers'],function(d){
      var custs=d.customers||{};
      Object.keys(custs).forEach(function(ph){delete custs[ph].nextFollowUp;});
      chrome.storage.local.set({customers:custs},function(){
        console.log('已清除所有回访标记');
      });
    });
    return;
  }
  n=n||8;
  chrome.storage.local.get(["customers"],function(d){
    var custs=d.customers||{},keys=Object.keys(custs),today=new Date().toISOString();
    if(keys.length===0){console.log("无客户数据");return;}
    var picks=keys.sort(function(){return Math.random()-0.5;}).slice(0,n);
    picks.forEach(function(ph){custs[ph].nextFollowUp=today;});
    chrome.storage.local.set({customers:custs},function(){
      console.log("已设置 "+picks.length+" 个客户今日回访");
      if(isLoggedIn)checkFollowups();
    });
  });
};

// ========== CFR 快速计算器 ==========
function calcCFR(){
  var fobRmb=parseFloat(document.getElementById('cfrFob').value)||0;
  var rate=parseFloat(document.getElementById('cfrRate').value)||6.7;
  var cbm=parseFloat(document.getElementById('cfrCbm').value)||0;
  var cbmPrice=parseFloat(document.getElementById('cfrCbmPrice').value)||0;
  var fobUsd=fobRmb/rate;
  var freight=cbm*cbmPrice;
  var profit=1000,markup=500;
  var cfr=fobUsd+freight+profit+markup;
  document.getElementById('cfrFobR').textContent="$"+fobUsd.toFixed(0).toLocaleString();
  document.getElementById('cfrFreightR').textContent="$"+freight.toLocaleString();
  document.getElementById('cfrFinal').textContent="$"+cfr.toFixed(0).toLocaleString();
}
// bind events
var btnCFR=document.getElementById('btnCalcCFR');
console.log('[CRM] btnCalcCFR found:',!!btnCFR);
if(btnCFR){btnCFR.onclick=function(){console.log('[CRM] calcCFR clicked');calcCFR();};}
else{console.log('[CRM] btnCalcCFR NOT FOUND!');}
["cfrFob","cfrCbm","cfrCbmPrice"].forEach(function(id){
  var el=document.getElementById(id);
  if(el){el.oninput=calcCFR;el.onchange=calcCFR;}
});

// ========== 文件列表显示 ==========
function showFilesList(phone, orderNum, type){
  console.log('[CRM] showFilesList:',phone,orderNum,type);
  var p='o'+orderNum+'_';
  var listEl=document.getElementById(p+type+'_files');
  console.log('[CRM] files div:',p+type+'_files',!!listEl);
  if(!listEl)return;
  chrome.storage.local.get(['doc_records'],function(d){
    var records=d.doc_records||{};
    var key=phone+'_order'+orderNum+'_'+type;
    var files=records[key]||[];
    if(!files.length){listEl.innerHTML='';return;}
    listEl.innerHTML=files.map(function(f,i){
      return '<span style="display:inline-flex;align-items:center;gap:4px;margin-right:8px">'+
        '<a href="'+f.data+'" download="'+f.fileName+'" target="_blank" style="color:#1a56db;cursor:pointer;font-size:10px">📄 '+f.fileName+' ('+(f.size/1024).toFixed(0)+'KB)</a>'+
        '<span class="del-file-btn" data-phone="'+phone+'" data-order="'+orderNum+'" data-type="'+type+'" data-index="'+i+'" style="color:#dc2626;cursor:pointer;font-size:12px;font-weight:bold" title="删除">✕</span>'+
      '</span>';
    }).join('');
    // Event delegation for delete
    if(!listEl._hasDelListener){
      listEl._hasDelListener=true;
      listEl.addEventListener('click',function(e){
        if(!e.target.classList.contains('del-file-btn'))return;
        var phone=e.target.dataset.phone;
        var orderNum=parseInt(e.target.dataset.order);
        var type=e.target.dataset.type;
        var index=parseInt(e.target.dataset.index);
        chrome.storage.local.get(['doc_records'],function(d2){
          var recs=d2.doc_records||{};
          var k=phone+'_order'+orderNum+'_'+type;
          if(recs[k]){recs[k].splice(index,1);if(!recs[k].length)delete recs[k];}
          chrome.storage.local.set({doc_records:recs},function(){
            showFilesList(phone,orderNum,type);
          });
        });
      });
    }
  });
}