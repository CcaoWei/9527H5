<template>
  <div class="page">
    <div class="nav" :style="{'padding-top':statusBarHeight}">
      <div class="back" @click="navigateBack">
        <i class="icon icon-back nav-back"></i>  
      </div>
      <div class="title">设备使用详情统计</div>  
      <div class="date">
        <!-- 昨日
        <i class="icon icon-arrow nav-arrow"></i> -->
      </div>    
    </div>
    <div class="pad" :style="{'padding-top':statusBarHeight}"></div>
    <div class="search" ref="search">
      <div class="search-item-wrap">
        <div class="search-item-label">时间</div>
        <div class="search-item-content">
          <div class="search-item-content-row">
            <div :class="['radio-button',time==0?'active':'']" data-type="0" @click="changeTimeType">昨日</div>
            <div class="radio-button" :class="{'active': time==1}" data-type="1" @click="changeTimeType">7日</div>
            <div :class="{'radio-button':true,active:time==2}" data-type="2" @click="changeTimeType">30日</div>
          </div>
          <div class="search-item-content-row">
            <div class="cascade" data-type="4">自定义</div>
            <div :class="{'radio-button':true,active:time==4}" data-type="4" @click="handleTimeStart">{{formateStartDate}}</div>
            <div class="cascade">至</div>
            <div :class="{'radio-button':true,active:time==4}" data-type="4" @click="handleTimeEnd">{{formateEndDate}}</div>
          </div>
        </div>
      </div>
      <div class="search-item-wrap">
        <div class="search-item-label">区域</div>
        <div class="search-item-content">
          <div class="search-item-content-row">
            <div :class="{'radio-button':true,active:area==0}" data-type="0" @click="changeAreaType">本店</div>
            <div :class="{'radio-button':true,active:area==1}" data-type="1" @click="changeAreaType">本地</div>
            <div :class="{'radio-button':true,active:area==2}" data-type="2" @click="changeAreaType">全国</div>
          </div>
        </div>
      </div>
      <div class="search-item-wrap">
        <div class="search-item-label">排序</div>
        <div class="search-item-content">
          <div class="search-item-content-row">
            <div :class="{'radio-button-mini':true,active:sort==0,}" data-type="0" @click="changeSortType">总启动次数</div>
            <div :class="{'radio-button-mini':true,active:sort==1,}" data-type="1" @click="changeSortType">出礼总数</div>
            <div :class="{'radio-button-mini':true,active:sort==2,}" data-type="2" @click="changeSortType">投币总数</div>
            <div v-if="device==4" :class="{'radio-button-mini':true,active:sort==3,}"data-type="3" @click="changeSortType">出彩总数</div>
            <div v-else :class="{'radio-button-mini':true,'radio-button-mini-disabled':true}"  data-type="3">出彩总数</div>
          </div>
        </div>
      </div>
      <div class="search-item-wrap">
        <div class="search-item-label">分类</div>
        <div class="search-item-content">
          <div class="search-item-content-row">
            <div :class="{'radio-button-mini':true,active:device==0,}" data-type="0" @click="changeDeviceType">全部</div>
            <div :class="{'radio-button-mini':true,active:device==2,}" data-type="2" @click="changeDeviceType">礼品机</div>
            <div :class="{'radio-button-mini':true,active:device==4,}" data-type="4" @click="changeDeviceType">彩票机</div>
            <div :class="{'radio-button-mini':true,active:device==3,}" data-type="3" @click="changeDeviceType">其他设备</div>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <mt-loadmore 
        :auto-fill="false"
        :bottom-method="loadBottom" 
        :bottom-all-loaded="allLoaded" 
        ref="loadmore" 
      >
        <div class="item-wrap" v-for="item in deviceList" :key="item.deviceId">
          <div class="item-header">
            <div class="item-header-left">
              <img class="store-logo" :src="item.pictureUrl" />
              <div class="unit-price">{{item.price + item.currencyName}}/次</div>
            </div>
            <div class="item-header-right"> 
              <div class="title">{{item.deviceName}}</div>
              <div class="info">
                <div class="info-item">
                  <div class="num-wrap"><div class="num">{{item.allGamesNumber}}</div>次</div>
                  <div class="tip">游戏总次数</div>
                </div>
                <div class="info-item">
                  <div class="num-wrap"><div class="num">{{item.allCoinNumber}}</div>{{item.currencyName}}</div>
                  <div class="tip">投币总数</div>
                </div>
                <div class="info-item">
                  <div class="num-wrap"><div class="num">{{item.deviceGiftStatus==4?item.allLotteryAmount:item.allBonusNumber}}</div>{{item.deviceGiftStatus==4?'张':'次'}}</div>
                  <div class="tip">{{item.deviceGiftStatus==4?'出彩总数':'出礼总数'}}</div>
                </div>
              </div>
            </div>
          </div>
        
          <div class="list">
            <div :class="{'item-child-wrap':true,'show':item.show}">
              <div class="list-item" v-for="gift in item.deviceGiftAnalysisModels" :key="gift.giftId">
                <div class="list-item-left">
                  <img class="gift-logo" :src="gift.giftPictureUrl" />
                </div>
                <div class="list-item-right">
                  <div class="title-wrap">
                    <div class="title">{{gift.giftName}}</div>
                    <!-- <div class="price">¥{{gift.originalPrice}}</div> -->
                  </div>
                  <div class="info">
                      <div class="info-item">
                        <div class="num">{{gift.percent == 'Infinity' ? '暂无' : gift.percent}}</div>
                        <div class="tip">平均出礼币数</div>
                      </div>
                      <div class="info-item">
                        <div class="num">{{gift.giftCoinNumber}}</div>
                        <div class="tip">投币数量</div>
                      </div>
                      <div class="info-item">
                        <div class="num">{{gift.giftGamesNumber}}</div>
                        <div class="tip">游戏次数</div>
                      </div>
                      <div class="info-item">
                        <div class="num">{{gift.giftBonusNumber}}</div>
                        <div class="tip">{{gift.deviceGiftStatus==4?'出彩次数':'出礼总数'}}</div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="item.deviceGiftAnalysisModels && item.deviceGiftAnalysisModels.length > 0" class="list-bottom" @click="handleShow(item)">
              设备礼品数据
              <i :class="{'icon icon-down':true,'arrows':item.show}"></i>
            </div>
          </div>
        </div>
      </mt-loadmore>
    </div>
     <mt-datetime-picker
      ref="startPicker"
      type="date"
      v-model="dateStart"
      @confirm="selectStartTime"
      >
    </mt-datetime-picker>
    <mt-datetime-picker
      ref="endPicker"
      type="date"
      v-model="dateEnd"
      @confirm="selectEndTime"
      >
    </mt-datetime-picker>
  </div>
</template>

<script>
import { Loadmore, Toast, DatetimePicker } from 'mint-ui'
import 'mint-ui/lib/style.css'

export default {
  data () {
    return {
      dateStart: '2018-05-14',
      dateEnd: '2018-05-21',
      time: 0,
      deviceList: [],
      allLoaded: false,
      headers: {},
      paging: {
        pageSize: 6,
        currentPage: 1
      },
      deviceFontsize: 16,
      statusBarHeight: '',
      area: 0,
      sort: 0,
      device: 0,
      show: false,
    }
  },
  components: {
    'mt-loadmore': Loadmore,
    'mt-datetime-picker': DatetimePicker,
  },
  mounted () {
    var u = navigator.userAgent, app = navigator.appVersion;
    // var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
    this.isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
   
    const str =  decodeURI(location.href).split('?')[1]
    const args = str.split('&');

    args.forEach((item) => {
      const arr = item.split('=');
      if (arr[0] == 'storeId') {
        this.storeId = arr[1];
      } else if (arr[0] == 'statusBarHeight') {
        this.statusBarHeight = arr[1] + 'px';
      } else if (arr[0] == 'cityCode') {
        this.cityCode = arr[1];
      } else if (arr[0] == 'countryCode') {
        this.countryCode = arr[1];
      } else {
        this.headers[arr[0]] = arr[1];
      }
    })
    this.dateStart = this.formateBeforeDate(1);
    this.dateEnd = this.formateBeforeDate(1);
    this.queryDeviceInfo();
  },
  computed: {
    formateStartDate:function () {
      let formateDate = this.dateStart;
       if(typeof formateDate === 'object') {
        const date = new Date(formateDate);
        const y = date.getFullYear();
        let m = date.getMonth() + 1;
        if(m < 10) {
          m = '0' + m;
        }
        let d = date.getDate();
        if(d < 10) {
          d = '0' + d;
        }
        formateDate = y + '-' + m + '-' + d;
      }
      return formateDate;
    },
    formateEndDate:function () {
      let formateDate = this.dateEnd;
      if(typeof formateDate === 'object') {
        const date = new Date(formateDate);
        const y = date.getFullYear();
        let m = date.getMonth() + 1;
        if(m < 10) {
          m = '0' + m;
        }
        let d = date.getDate();
        if(d < 10) {
          d = '0' + d;
        }
        formateDate = y + '-' + m + '-' + d;
      }
      return formateDate;
    }
  },
  methods: {
    handleShow(info) {
      this.deviceList.forEach((item) => {
        if(item.deviceId == info.deviceId) {
          item.show = !item.show;
        } else {
          item.show = false;
        }
      })
    },  
     // 地区
    changeAreaType (e) {
      this.paging = {
        currentPage: 1,
        pageSize: 9
      }
      this.deviceList = [];
      const { type } = e.target.dataset;
      this.area = type;
      this.queryDeviceInfo();
    },
    // 排序
    changeSortType (e) {
      this.paging = {
        currentPage: 1,
        pageSize: 9
      }
      this.deviceList = [];
      const { type } = e.target.dataset;
      this.sort = type;
      this.queryDeviceInfo();
    },
    // 设备排序
    changeDeviceType (e) {
      this.paging = {
        currentPage: 1,
        pageSize: 9
      }
      this.deviceList = [];
      const { type } = e.target.dataset;
      this.device = type;
      this.queryDeviceInfo();
    },
    // 回退
    navigateBack() {
      if(this.isIOS) {
        window.webkit.messageHandlers.finish.postMessage(null);
      } else {
        window.APP.finish();
      }
    },
    // loading
    showLoading (title) {
      this.Loading = Toast({
        message: title||'加载中',
        iconClass: 'icon icon-loading',
        duration: -1
      });
    },
    hideLoading () {
      this.Loading.close();
      this.Loading = null;
    },
    // 加载更多
    loadBottom() {
      this.paging.currentPage += 1;
      this.queryDeviceInfo({
        currentPage: this.paging.currentPage,
        pageSize: this.paging.pageSize,
      },() => {
        this.loadOver();
      },() => {
        this.loadOver();
      })
    },
    loadOver() {
        this.$refs.loadmore.onBottomLoaded();
    },
    queryDeviceInfo (newData,successfn,errfn) {
   
      this.showLoading();
      this.allLoaded = false;
      const headers = this.headers;
      let startTime = this.formateStartTime(this.dateStart); 
      let endTime = this.formateEndTime(this.dateEnd);

      const data = {
          storeId: this.storeId,
          deviceSortType: this.sort,
          deviceGiftStatus: this.device,
          cityCode: this.cityCode,
          countryCode: this.countryCode,
          areaType: this.area,
          startTime,
          endTime,
          currentPage: 1,
          pageSize: 6,
          ...newData
        };

       this.$axios({
        url:`${this.utils.httpAjax}api/box/deviceAnalysis/dataAnalysisDevice`,
        method: 'POST',
        data,
        headers,
      }).then((res) => {
        if(this.Loading) {
          this.hideLoading();
        }
        const {data} = res;
        let isFirstItem = true;
        if(data.code === 0) {
          data.pageInfo.list.map((item) => {
            if(item.pictureUrl) {
              item.pictureUrl += '/thumbnail';
            } else {
              item.pictureUrl = 'https://wx-miniprogram-source.oss-cn-beijing.aliyuncs.com/img/gifts/lipinmoren.png';
            }
            if(item.deviceGiftAnalysisModels) {
              item.show = false;
           
              item.deviceGiftAnalysisModels.forEach((giftItem) => {
                if(giftItem.giftPictureUrl) {
                  giftItem.giftPictureUrl += '/thumbnail'
                } else {
                  giftItem.giftPictureUrl = 'https://wx-miniprogram-source.oss-cn-beijing.aliyuncs.com/img/gifts/lipinmoren.png';
                }
                const p = giftItem.giftCoinNumber / giftItem.giftBonusNumber;
                giftItem.percent = p.toFixed(1);
              });
            }
          });
          this.deviceList.forEach((item) => {
              if(item.show) {
                isFirstItem = false
              }
          })
          if(isFirstItem && this.deviceList.length > 0) {
            debugger
            this.deviceList[0].show = true;
          }
          if(isFirstItem &&  this.deviceList.length == 0 && data.pageInfo.list.length > 0) {
            data.pageInfo.list[0].show = true;
          }
          this.deviceList = this.deviceList.concat(data.pageInfo.list);
          this.allLoaded =  data.pageInfo.hasNextPage ? false : true;
          if(data.pageInfo.list.length) {
          }
        } else {
          this.deviceList = [];
        }
        if(successfn) {
          successfn();
        }
      }).catch((e) => {
        console.log(e)
        this.paging = {
          currentPage: 1,
          pageSize: 6
        }
        this.allLoaded = false;
        this.deviceList = [];
        Toast({
          message: '请求失败',
          duration: 2000
        });
        if(this.Loading) {
          this.hideLoading();
        }
        if(errfn) {
          errfn();
        }
      })
    
    },
     // 打开时间选择弹框
    handleTimeStart () {
      this.$refs.startPicker.open();
    },
    handleTimeEnd () {
      this.$refs.endPicker.open();
    },
    // 确定选择时间
    selectStartTime () {
      if(this.dateStart > this.dateEnd) {
        this.dateEnd = this.dateStart;
      }
      this.changeTimeType();
    },
    selectEndTime () {
      if(this.dateStart > this.dateEnd) {
        this.dateStart = this.dateEnd;
      }
      this.changeTimeType();
    },
    // 时间
    changeTimeType (e) {
      this.paging = {
        currentPage: 1,
        pageSize:6
      }
      this.deviceList = [];
      if(e) {
        const { type } = e.target.dataset;
        this.time = type;

        switch (type) {
          case '0':
            this.dateStart = this.formateBeforeDate(1);
            this.dateEnd = this.formateBeforeDate(1);
            this.searchTime = '昨日';
            this.queryDeviceInfo();
            break;
          case '1':
            this.dateStart =  this.formateBeforeDate(7);
            this.dateEnd = this.formateBeforeDate(1);
            this.searchTime = '7日';
            this.queryDeviceInfo();
            break;
          default:
            this.dateStart =  this.formateBeforeDate(30);
            this.dateEnd = this.formateBeforeDate(1);
            this.searchTime = '30日';
            this.queryDeviceInfo();
        }
      } else {
        this.time = 4;
        // this.searchTime = this.formateDate(0,this.dateStart) + this.formateDate(0,this.endStart);
        this.queryDeviceInfo();
      }
    },
    formateBeforeDate (day) {
      const timestamp = new Date().getTime() - day * 24 * 3600 * 1000;
      const date = new Date(timestamp);
      let d = date.getDate();
      d = d < 10 ? `0${d}` : d;
      let m = date.getMonth() + 1;
      m = m < 10 ? `0${m}` : m;
      let y = date.getFullYear();
      y = y < 10 ? `0${y}` : y;
      return `${y}-${m}-${d}`
    },
    formateStartTime (day) {
      const time = new Date(day);
      const timestamp = time.getTime();
      const date = new Date(timestamp);
      let d = date.getDate();
      d = d < 10 ? `0${d}` : d;
      let m = date.getMonth() + 1;
      m = m < 10 ? `0${m}` : m;
      let y = date.getFullYear();
      y = y < 10 ? `0${y}` : y;
      return `${y}-${m}-${d} 00:00:00`
    },
    formateEndTime (day) {
      const time = new Date(day);
      const timestamp = time.getTime() + 24 * 60 * 60 * 1000;
      const date = new Date(timestamp);
      let d = date.getDate();
      d = d < 10 ? `0${d}` : d;
      let m = date.getMonth() + 1;
      m = m < 10 ? `0${m}` : m;
      let y = date.getFullYear();
      y = y < 10 ? `0${y}` : y;
      return `${y}-${m}-${d} 00:00:00`
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/styles/global.scss';

body {
  background:rgba(242,242,242,1);
  font-family:PingFangSC-Regular;
}
.page {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  padding: px2rem(46) 0 0 0;
  box-sizing: border-box;
  // overflow: hidden;
  .nav {
    position: fixed;
    top: 0;
    display: flex;
    align-items: center;
    width: 100vw;
    height: px2rem(46);
    background: #fff;
    box-sizing: content-box;
    .back {
      @include fl-c-m;
      height: 100%;
      width: px2rem(30);
      .nav-back {
        font-size: px2rem(24);
        color: #16A1FC;
      }
    }
    .title {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size:px2rem(18);
      color:rgba(51,51,51,1);
    }
    .date {
      height: 100%;
      width: px2rem(30);
    //   display: flex;
    //   align-items: center;
    //   justify-content: center;
    //   font-size:px2rem(16);
    //   color:rgba(22,161,252,1);
    //   .nav-arrow {
    //     font-size: px2rem(22);
    //   }
    }
  }
  .search {
    padding: px2rem(10) px2rem(10) 0 px2rem(10);
    height: px2rem(220);
    box-sizing: border-box;
    .search-item-wrap {
      display: flex;
      .search-item-label {
        flex: 0 0 px2rem(36);
        @include fl-st-m;
        height: px2rem(32);
        font-size:px2rem(14);
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(102,102,102,1);
      }
      .search-item-content {
        flex: 1;
        .search-item-content-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: px2rem(10);
          .cascade {
            @include fl-c-m;
            font-size:px2rem(14);
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(102,102,102,1);
          }
          .radio-button, .data-button, .radio-button-mini {
            @include fl-c-m;
            width: px2rem(100);
            height: px2rem(32);
            font-size: px2rem(14);
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(102,102,102,1);
            background:rgba(255,255,255,1);
            border-radius: px2rem(4);
            &.active {
              background:rgba(22,161,252, .2);
              color:rgba(22,161,252,1);
            }
            &.radio-button-mini-disabled {
              background: #eaeaea;
              color: #999;
            }
          }
          .radio-button-mini {
            width: px2rem(75);
          }
        }
      }
    }
  }
  $h: px2rem(220);
  .content {
    position: relative;
    height: calc(100% - #{$h});
    overflow-y: auto;

    .item-wrap {
      background: #fff;
      padding: 0 px2rem(11);
      margin-bottom: px2rem(10);
      .item-header {
        @include fl-c-m;
        height: px2rem(114);
        border-bottom: px2rem(1) solid rgba(239,237,238,1);
        // margin-bottom: px2rem(17);
        .item-header-left{
          position: relative;
          .store-logo {
            border:none;
            border-radius: px2rem(4);
            margin-right: px2rem(11);
            width: px2rem(80);
            height: px2rem(80);
          }
          .unit-price {
            position: absolute;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: calc(100% -  #{px2rem(11)});
            height: px2rem(18);
            font-size:px2rem(12);
            color:rgba(255,255,255,1);
            background:rgba(0,0,0,0.5);
          }
        }
        .item-header-right {
          flex: 1;
          display: flex;
          justify-content: space-between;
          flex-direction: column;
          height: px2rem(80);
          .title {
            max-width: px2rem(260);
            font-size: px2rem(16);
            font-weight:400;
            color:rgba(51,51,51,1);
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
          .info {
            @include fl-sb-m;
            .num-wrap {
              text-align: center;
              font-size: px2rem(13);
              color:rgba(102,102,102,1);
              .num {
                display: inline;
                font-size:px2rem(18);
                font-weight:500;
                color:rgba(22,161,252,1);
              }
            }
            .tip {
              font-size:px2rem(13);
              color:rgba(102,102,102,1);
            }
          }
        }
      }
      .list {
        .item-child-wrap {
          height: 0;
          overflow: hidden;
          &.show {
            height: auto;
          }
          .list-item {
            display: flex;
            padding-top: px2rem(17);
            .list-item-left {
              .gift-logo {
                border: none;
                border-radius: px2rem(4);
                margin-right:px2rem(8);
                width: px2rem(60);
                height: px2rem(60);
              }
            }
            .list-item-right {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              .title-wrap {
                display: flex;
                .title {
                  margin-right: px2rem(17);
                  max-width: px2rem(240);
                  font-size: px2rem(14);
                  color:rgba(51,51,51,1);
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  overflow: hidden;
                }
                .price {
                  font-size: px2rem(14);
                  color:rgba(102,102,102,1);
                }
              }
              .info {
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                .info-item {
                  text-align: center;
                  .num {
                    font-size: px2rem(14);
                    font-weight:500;
                    color:rgba(51,51,51,1);
                  }
                  .tip {
                    font-size: px2rem(13);
                    color:rgba(153,153,153,1);
                  }
                }
              }
            }
          }
        }
        .list-bottom {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: px2rem(16) 0;
          font-size: px2rem(14);
          color: #666666;
          .icon-down {
            margin-left: px2rem(5);
            margin-top: px2rem(2);
          }
          .arrows {
            transform: rotate(180deg);
          }
        }
      }
    }
  }
}


</style>

