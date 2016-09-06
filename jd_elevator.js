window.addEventListener("load",function(){
	elevator.init();
});
function getElemTop(elem){
	var sum=elem.offsetTop;
	while(elem.offsetParent!=null){
		sum+=elem.offsetParent.offsetTop;
		elem=elem.offsetParent;
	}
	return sum;
}
var elevator={
	FHEIGHT:0,
	UPLEVEL:0,
	DOWNLEVEL:0,
	DISTANCE:0,
	DURATION:1000,
	STEPS:100,
	interval:0,
	step:0,
	timer:null,
	moved:0,
	init:function(){
		this.interval=this.DURATION/this.STEPS;
		var style=getComputedStyle($("#f1"));
		this.FHEIGHT=parseFloat(style.height)+parseFloat(style.marginBottom);
		this.UPLEVEL=(innerHeight-this.FHEIGHT)/2;
		this.DOWNLEVEL=this.UPLEVEL+this.FHEIGHT;
		window.addEventListener("scroll",this.light.bind(this));
		$("#elevator>ul").addEventListener("mouseover",function(e){
			var target=e.target;
			if(target.nodeName!="UL"){
				target.nodeName=="A"&&(target=target.parentNode);
				target.$("a:first-child").style.display="none";
				target.$("a:last-child").style.display="block";
			}
		});
		$("#elevator>ul").addEventListener("mouseout",function(e){
			var target=e.target;
			if(target.nodeName!="UL"){
				target.nodeName=="A"&&(target=target.parentNode);
				var f=parseInt(target.$("a:first-child").innerHTML);
				var span=$("#f"+f+">header>span");
				if(span.className!="hover"){
					target.$("a:first-child").style.display="block";
					target.$("a:last-child").style.display="none";
				}
			}
		});
		$("#elevator>ul").addEventListener("click",this.scrollTo.bind(this));
	},
	light:function(){
		var spans=$(".floor>header>span");
		var scrollTop=document.body.scrollTop;
		for(var i=0;i<spans.length;i++){
			var elemTop=getElemTop(spans[i]);
			var li=$("#elevator>ul>li:nth-child("+(i+1)+")");
			if(elemTop>=scrollTop+this.UPLEVEL&&elemTop<scrollTop+this.DOWNLEVEL){
				spans[i].className="hover";
				li.$("a:first-child").style.display="none";
				li.$("a:last-child").style.display="block";
			}else{
				spans[i].className="";
				li.$("a:first-child").style.display="block";
				li.$("a:last-child").style.display="none";
			}
		}
		var span=$(".floor>header>span.hover");
		$("#elevator").style.display=span!=null?"block":"none";
	},
	scrollTo:function(e){
		if(this.timer==null){
			var target=e.target;
			if(target.className=="etitle"){
				var f=parseInt(target.previousElementSibling.innerHTML);
				var span=$("#f"+f+">header>span");
				var elemTop=getElemTop(span);
				this.DISTANCE=elemTop-this.UPLEVEL-document.body.scrollTop;
				this.step=this.DISTANCE/this.STEPS;
				this.timer=setInterval(this.scrollStep.bind(this),this.interval);
			}
		}
	},
	scrollStep:function(){
		window.scrollBy(0,this.step);
		this.moved++;
		if(this.moved==this.STEPS){
			clearInterval(this.timer);
			this.timer=null;
			this.moved=0;
		}
	}
}
