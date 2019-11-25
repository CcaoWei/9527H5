<template>
  <div class="page1">
    <div class="nav" :style="{'padding-top':arg.statusBarHeight}">
      <div class="back" @click="navigateBack">
        <i class="icon icon-back nav-back"></i>  
      </div>
      <div class="title">礼品详情</div>  
      <div class="date">
        <!-- 昨日
        <i class="icon icon-arrow nav-arrow"></i> -->
      </div>    
    </div>
    <div class="pad" :style="{'padding-top':arg.statusBarHeight}"></div>
    <div class="date-bar">{{arg.time + '-' + arg.address}}</div>
    <div class="gift-content">
      <div class="gift-pic-wrap">
        <img class="gift-picture" :src="arg.pictureUrl" alt="">
      </div>
      <div class="gift-list-wrap">
      
        <div class="gift-list-item">
          <div class="gift-list-item-title">抓取率</div>
          <div class="gift-list-item-value">{{detailInfo.catchRatio}}%</div>
        </div>
        <div class="gift-list-item">
          <div class="gift-list-item-title">抓取次数</div>
          <div class="gift-list-item-value">{{detailInfo.graspingTimes}}次</div>
        </div>
        <div class="gift-list-item">
          <div class="gift-list-item-title">捕中次数</div>
          <div class="gift-list-item-value">{{detailInfo.catchTimes}}次</div>
        </div>
        <div class="gift-list-item">
          <div class="gift-list-item-title">最长间隔多少次捕中</div>
          <div class="gift-list-item-value">{{detailInfo.maxCoinNumber == -1 ? '-' : detailInfo.maxCoinNumber + '次'}}</div>
        </div>
        <div class="gift-list-item">
          <div class="gift-list-item-title">最短间隔多少次捕中</div>
          <div class="gift-list-item-value">{{detailInfo.minCoinNumber == -1 ? '-' : detailInfo.minCoinNumber + '次'}}</div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { DatetimePicker, Loadmore, Toast } from 'mint-ui'
import 'mint-ui/lib/style.css'

export default {
  props: ['args','navBack'],
  data () {

    return {
      detailInfo: {},
      headers: {},
      arg: {}
    }
  },
  components: {
    // 'mt-datetime-picker': DatetimePicker,
    'mt-loadmore': Loadmore
  },
  created() {
    
  },
  mounted() {
    // const argJSON = decodeURI(location.href).split('?')[1].split('=')[1];
    // const arg = JSON.parse(argJSON);
    console.log(this.args)
    this.arg = this.args;
    this.headers = this.args.headers;
    this.queryGiftDetail();
  },
  methods: {
    navigateBack() {
      this.navBack();
    },
    queryGiftDetail () {
      this.showLoading();
      let startTime = this.formateStartTime(this.arg.startTime); 
      let endTime = this.formateEndTime(this.arg.endTime);
      const data = {
          giftId: this.arg.giftId,
          startTime,
          endTime,
      };
     
      this.$axios({
        url:`${this.utils.httpAjax}api/box/giftAnalysis/getAnalysisGiftInfo`,
        method: 'POST',
        data,
        headers: this.headers,
      }).then((res) => {
        if(this.Loading) {
          this.hideLoading();
        }
        const {data} = res;
        if(data.code === 0) {
          data.object.catchRatio = parseInt(data.object.catchRatio * 100);
    
          this.detailInfo = data.object
        }
      }).catch(() => {
        if(this.Loading) {
          this.hideLoading();
        }
        Toast({
          message: '请求失败',
          duration: 2000
        });
      })
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
}
.page1 {
  display: flex;
  flex-direction: column;
  padding: px2rem(46) 0 0 0;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
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
  .date-bar {
    @include fl-c-m;
    flex: 0 0 px2rem(32);
    background:rgba(22,161,252, .2);
    font-size: px2rem(14);
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(22,161,252,1);
  }
  .gift-content {
    flex: 1;
    background: #fff;
    .gift-pic-wrap {
      @include fl-c-m;
      padding: px2rem(16) 0;
      .gift-picture {
        width: px2rem(180);
        height: px2rem(180);
        background: #ff0;
        border-radius:px2rem(4);
      }
    }
    .gift-list-wrap {
      padding: 0 px2rem(10);
      box-sizing: border-box;
      .gift-list-item {
        @include fl-sb-m;
        margin-bottom: px2rem(16);
        padding-bottom: px2rem(16);
        border-bottom: px2rem(1) solid rgba(239,237,238,1);
        .gift-list-item-title, .gift-list-item-value {
          font-size: px2rem(16);
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:#666;
        }
        .gift-list-item-value {
          color:#333;
        }
      }
    }
  }
}


</style>

