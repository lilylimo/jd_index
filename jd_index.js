/*封装$*/
window.$=HTMLElement.prototype.$=function(selector){
    var elems=(this==window?document:this)
        .querySelectorAll(selector);
    return elems.length==0?null:elems.length==1?elems[0]:elems;
}
/*广告图片数组*/
var images=[
	{"i":0,"img":"images/index/banner_01.jpg"},
    {"i":1,"img":"images/index/banner_02.jpg"},
    {"i":2,"img":"images/index/banner_03.jpg"},
    {"i":3,"img":"images/index/banner_04.jpg"},
    {"i":4,"img":"images/index/banner_05.jpg"},
];
var slider={
	LIWIDTH:0,
	DISTANCE:0,
	DURATION:1000,
	STEPS:100,
	interval:0,
	step:0,
	timer:null,
	moved:0,
	WAIT:3000,
	canAuto:true,
	init:function(){
		this.interval=this.DURATION/this.STEPS;
		this.LIWIDTH=parseFloat(getComputedStyle($("#slider")).width);
		this.updateView();
		var me=this;
		$("#indexs").addEventListener("mouseover",function(e){
			var target=e.target;
			if(target.nodeName=="LI"&&target.className!="hover"){
				clearTimeout(me.timer);
				me.updateView();
				me.timer=null;
				me.moved=0;
				$("#imgs").style.left="";
				me.move(target.innerHTML-$("#indexs>li.hover").innerHTML);
			}
		});
		$("#slider").addEventListener("mouseover",function(){
			me.canAuto=false;
		});
		$("#slider").addEventListener("mouseout",function(){
			me.canAuto=true;
		});
		this.autoMove();
	},
	updateView:function(){
		for(var i=0,html1="",html2="";i<images.length;i++){
			html1+='<li><img src="'+images[i].img+'"></li>';
			html2+="<li>"+(i+1)+"</li>";
		}
		$("#imgs").innerHTML=html1;
		$("#imgs").style.width=images.length*this.LIWIDTH+"px";
		$("#indexs").innerHTML=html2;
		$("#indexs>li:nth-child("+(images[0].i+1)+")").className="hover";
		
	},
	autoMove:function(){
		this.timer=setTimeout(function(){
			if(this.canAuto){
				this.move(1);
			}else{
				this.autoMove();
			}
		}.bind(this),this.WAIT);
	},
	move:function(n){
		this.DISTANCE=n*this.LIWIDTH;
		this.step=this.DISTANCE/this.STEPS;
		if(n<0){
			images=images.splice(images.length+n,-n).concat(images);
			this.updateView();
			$("#imgs").style.left=n*this.LIWIDTH+"px";
		}
		this.timer=setTimeout(this.moveStep.bind(this,n),this.interval);
	},
	moveStep:function(n){
		var left=parseFloat(getComputedStyle($("#imgs")).left);
		$("#imgs").style.left=left-this.step+"px";
		this.moved++;
		if(this.moved<this.STEPS){
			this.timer=setTimeout(this.moveStep.bind(this,n),this.interval);
		}else{
			this.timer=null;
			this.moved=0;
			if(n>0){
				images=images.concat(images.splice(0,n));
				this.updateView();
			}
			$("#imgs").style.left="";
			this.autoMove();
		}
	}
}
window.addEventListener("load",function(){
	slider.init();
});

