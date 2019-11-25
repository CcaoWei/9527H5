<template>
  <div class="page" v-if="!showDetail">
    <div class="nav" :style="{'padding-top':statusBarHeight}">
      <div class="back" @click="navigateBack">
        <i class="icon icon-back nav-back"></i>  
      </div>
      <div class="title">礼品分析</div>  
      <div class="date">
        <!-- 昨日
        <i class="icon icon-arrow nav-arrow"></i> -->
      </div>    
    </div>
    <div class="pad" :style="{'padding-top':statusBarHeight}"></div>
    <!-- 检索 start -->
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
          <div class="search-item-content-row" style="justify-content: flex-start;">
            <!-- <div :class="{'radio-button':true,active:sort==0}" data-type="0" @click="changeSortType">人气值</div> -->
            <div :class="{'radio-button':true,active:sort==1,special:true}" data-type="1" @click="changeSortType">抓取次数</div>
            <div :class="{'radio-button':true,active:sort==2}" data-type="2" @click="changeSortType">捕中次数</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 检索 end -->
    <div class="content">
      <mt-loadmore 
        :auto-fill="false"
        :bottom-method="loadBottom" 
        :bottom-all-loaded="allLoaded" 
        ref="loadmore" 
        >
          <div class="gift-card-item" v-for="(item,index) in giftList" :key="item.id" @click="navToDetail(item)">
            <div class="item-top">
              <div :class="{'gift-sign':true,'gift-signs': index > 2}">TOP {{index + 1}}</div>
              <img class="gift-picture" :src="item.pictureUrl" />
            </div>
            <div class="item-bottom">
              <div class="item-title">{{item.giftName}}</div>
              <!-- <div class="item-row">
                <div class="item-name">人气值</div>
                <div class="item-value">{{item.popularity}}</div>
              </div> -->
              <div class="item-row">
                <div class="item-name">抓取次数</div>
                <div class="item-value">{{item.graspingTimes}}</div>
              </div>
              <div class="item-row">
                <div class="item-name">捕中次数</div>
                <div class="item-value">{{item.catchTimes}}</div>
              </div>
            </div>
          </div>
        <div class="clear"></div>
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
  <detail v-else :args="detailArg" :navBack="navBack"></detail>
</template>

<script>
import { DatetimePicker, Loadmore, Toast } from 'mint-ui'
import Detail from '../giftDetail/index.vue';
import 'mint-ui/lib/style.css'

export default {
  data () {

    return {
      showDetail: false,
      dateStart: '2018-05-14',
      dateEnd: '2018-05-21',
      searchTime: '昨日',
      time: 0,
      area: 0,
      sort: 1,
      giftList: [],
      address: '本店',
      allLoaded: false,
      height: 0,
      paging: {
        pageSize: 9,
        currentPage: 1
      },
      storeId:0,
      headers: {},
      statusBarHeight: '',
      detailArg: {}
    }
  },
  components: {
    'mt-datetime-picker': DatetimePicker,
    'mt-loadmore': Loadmore,
    'detail': Detail,
  },
  mounted () {
    
    var u = navigator.userAgent, app = navigator.appVersion;
    // var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
    this.isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    const str = decodeURI(location.href).split('?')[1];
    const args = str.split('&');
    
    args.forEach((item) => {
      const arr = item.split('=');
      if(arr[0] == 'storeId') {
        this.storeId = arr[1];
      } else if (arr[0] == 'cityCode') {
        this.cityCode = arr[1];
      } else if (arr[0] == 'countryCode') {
        this.countryCode = arr[1];
      } else if(arr[0] == 'statusBarHeight') {
        this.statusBarHeight = arr[1] + 'px';
      } else {
        this.headers[arr[0]] = arr[1];
      }
    })

    // this.height = getComputedStyle(this.$refs.search).height;
    this.dateStart = this.formateBeforeDate(1);
    this.dateEnd = this.formateBeforeDate(1);
   
    this.queryGiftInfo();
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
    navBack () {
      this.showDetail = false;
    },
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
    // 下拉刷新
    loadBottom() {
      this.paging.currentPage += 1;
      this.queryGiftInfo({
        currentPage: this.paging.currentPage,
        pageSize: this.paging.pageSize,
      },() => {
        this.loadOver();
      },() => {
        this.loadOver();
      })
    },
    // 关闭下拉刷新
    loadOver() {
      // this.$refs.loadmore.onTopLoaded();
      this.$refs.loadmore.onBottomLoaded();
    },
    // 请求礼品信息
    queryGiftInfo (newData,successfn,errfn) {
      
      this.showLoading();
      this.allLoaded = false;
      const headers = this.headers;

      let startTime = this.formateStartTime(this.dateStart); 
      let endTime = this.formateEndTime(this.dateEnd);
    
      const data = {
          storeId: this.storeId,
          startTime,
          endTime,
          sortType: this.sort - 0,
          areaType: this.area - 0,
          currentPage: 1,
          pageSize: 9,
          ...newData
      };
  
      if (this.area == 1) {
        data.cityCode = this.cityCode;
      }
      if (this.area == 2) {
        data.countryCode = this.countryCode;
      }
     
      this.$axios({
        url:`${this.utils.httpAjax}api/box/giftAnalysis/dataAnalysisGift`,
        method: 'POST',
        data,
        headers,
      }).then((res) => {
        if(this.Loading) {
          this.hideLoading();
        }
        const {data} = res;
        if(data.code === 0) {
          data.pageInfo.list.map((item) => {
            if(item.pictureUrl) {
              item.pictureUrl += '/thumbnail';
            } else {
              item.pictureUrl = 'https://wx-miniprogram-source.oss-cn-beijing.aliyuncs.com/img/gifts/lipinmoren.png';
            }
          });
          this.giftList = this.giftList.concat(data.pageInfo.list);
          this.allLoaded =  data.pageInfo.hasNextPage ? false : true;
          if(data.pageInfo.list.length) {
            // this.paging.currentPage = this.paging.currentPage + 1;
          }
        } else {
          this.giftList = [];
        }
        if(successfn) {
          successfn();
        }
      }).catch(() => {
        if(this.Loading) {
          this.hideLoading();
        }
        this.giftList = [];
        this.allLoaded = false;
        this.paging = {
          currentPage: 1,
          pageSize: 9
        }
        Toast({
          message: '请求失败',
          duration: 2000
        });
        if(errfn) {
          errfn();
        }
      })
    
    },
    // 跳转
    navToDetail(item) {
      item.time = this.searchTime;
      item.address = this.address;
      item.startTime = this.dateStart;
      item.endTime = this.dateEnd;
      item.headers = this.headers;
      item.statusBarHeight = this.statusBarHeight;
      // location.href=`../giftDetail/giftDetail.html?info=${JSON.stringify(item)}`;
      this.detailArg = item;
      this.showDetail = true;
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
      this.giftList = [];
      this.paging = {
        currentPage: 1,
        pageSize: 9
      }
      if(e) {
        const { type } = e.target.dataset;
        this.time = type;

        switch (type) {
          case '0':
            this.dateStart = this.formateBeforeDate(1);
            this.dateEnd = this.formateBeforeDate(1);
            this.searchTime = '昨日';
            this.queryGiftInfo();
            break;
          case '1':
            this.dateStart =  this.formateBeforeDate(7);
            this.dateEnd = this.formateBeforeDate(1);
            this.searchTime = '7日';
            this.queryGiftInfo();
            break;
          default:
            this.dateStart =  this.formateBeforeDate(30);
            this.dateEnd = this.formateBeforeDate(1);
            this.searchTime = '30日';
            this.queryGiftInfo();
        }
      } else {
        this.time = 4;
        this.searchTime = this.formateStartTime(this.dateStart,true) + '-' + this.formateStartTime(this.dateEnd, true);
        this.queryGiftInfo();
      }
    },
    // 地区
    changeAreaType (e) {
      this.paging = {
        currentPage: 1,
        pageSize: 9
      }
      this.giftList = [];
      const { type } = e.target.dataset;
      this.area = type;
      if(type == 0) {
        this.address = '本店';
      } else if (type == 1) {
        this.address = '本地';
      } else {
        this.address = '全国';
      }
      this.queryGiftInfo();
    },
    // 排序
    changeSortType (e) {
      this.paging = {
        currentPage: 1,
        pageSize: 9
      }
      this.giftList = [];
      const { type } = e.target.dataset;
      this.sort = type;
      this.queryGiftInfo();
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
    formateStartTime (day, sp) {
      const time = new Date(day);
      const timestamp = time.getTime();
      const date = new Date(timestamp);
      let d = date.getDate();
      d = d < 10 ? `0${d}` : d;
      let m = date.getMonth() + 1;
      m = m < 10 ? `0${m}` : m;
      let y = date.getFullYear();
      y = y < 10 ? `0${y}` : y;
       if(sp) {
        return `${y}年${m}月${d}日`
      }
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
}
.page {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: px2rem(46) px2rem(10) px2rem(10) px2rem(10);
  height: 100vh;
  box-sizing: border-box;
  .nav {
    position: fixed;
    top: 0;
    left: 0;
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
    padding-top: px2rem(10);
    height: px2rem(178);
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
          .radio-button, .data-button {
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
          }
          .special {
            margin-right: px2rem(10);
          }
        }
      }
    }
  }
  $h:px2rem(224);
  .content {
    flex: 1;
    // height: calc(100% - #{$h});
    overflow-y: auto;
    .gift-card-item {
      &:nth-child(3n) {
        margin-right: 0;
      }
      float: left;
      margin-right: px2rem(5);
      // display: inline-block;;
      border-radius: px2rem(4);
      background: #fff;
      overflow: hidden;
     
      .item-top {
        position: relative;
        width: px2rem(114);
        height: px2rem(86);
        box-sizing: border-box;
        overflow: hidden;
        .gift-sign {
          position:absolute;
          top: 0;
          left: 0;
          @include fl-c-m;
          min-width: px2rem(42);
          height: px2rem(18);
          background:rgba(252,136,22,1);
          border-radius: px2rem(4) 0 px2rem(8) 0;
          font-size: px2rem(12);
          font-family:PingFangSC-Medium;
          font-weight:500;
          color:rgba(255,255,255,1);
        }
        .gift-signs {
          background:rgba(182,182,182,1);
        }
        .gift-picture {
          position: absolute;
          width: px2rem(130);
          height: px2rem(130);
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
          z-index:0;
        }
      }
      .item-bottom {
        padding: px2rem(6);
        width: px2rem(114);
        // height: px2rem(84);
        box-sizing: border-box;
        .item-title {
          font-size: px2rem(14);
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(51,51,51,1);
          max-width: px2rem(100);
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        .item-row {
          @include fl-sb-m;
          .item-name, .item-value {
            font-size: px2rem(12);
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(102,102,102,1);
          }
        }
      }
    }
    .clear {
      clear: both;
    }

  }
}


</style>

