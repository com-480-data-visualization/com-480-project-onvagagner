!function(){
  var viz = { version: "1.4.0" };
  
  viz.biPartite = function(){
	var key_scale, value_scale
	  ,keyPrimary, keySecondary, value
	  ,width, height, orient, barSize, min, pad
	  ,data, fill, sel, edgeOpacity, duration
	  ,sortPrimary, sortSecondary, edgeMode
	  ,refresh=true, bars

	function biPartite(_){
	  sel=_;
	  updateLocals()
	  bars = biPartite.bars();
	  
	  sel.select(".viz-biPartite").remove();	
	  
	  var bp = sel.append("g").attr("class","viz-biPartite")
		   
	  bp.selectAll(".viz-biPartite-edge")
		  .data(bars.edges)
		  .enter()
		  .append("path")
		  .attr("class","viz-biPartite-edge")
		  .attr("d",function(d){ return d.path; })
		  .style("fill-opacity",biPartite.edgeOpacity())
		  .style("fill", function(d){ return fill(d); })
	   
	  bp.selectAll(".viz-biPartite-mainBar")
		  .data(bars.mainBars)
		  .enter()
		  .append("g")
		  .attr("transform", function(d){ return "translate("+d.x+","+d.y+")";})
		  .attr("opacity", 1)
		  .attr("class","viz-biPartite-mainBar")
		  .append("rect")
		  .attr("x",fx).attr("y",fy).attr("width",fw).attr("height",fh)
		  .style("fill-opacity",0)

	  const mainBars = bp.selectAll(".viz-biPartite-mainBar")

		  // small black line on the secondary side
	  mainBars
		  .append("rect")
		  .attr("x", d => (d.part == "primary" ? -1 : 1) * (fx(d) + fw(d))).attr("y",fy).attr("width", 2).attr("height",fh)
		  .attr("fill", "black")

		  // label
	  mainBars
		  .append("text").attr("class", ".viz-biPartite-label")
		  .attr("x", d => d.part == "primary" ? -30 : 30)
		  .attr("y", d => +6)
		  .text(d => d.key)
		  .attr("text-anchor", d => (d.part == "primary" ? "end" : "start"))

	  mainBars
		  .style("cursor", "pointer")
		  //.on("mouseenter",biPartite.mouseover)
		  //.on("mouseleave",biPartite.mouseout)
		  .on("click", biPartite.mouseover)

		  // remove selection
	  d3.select("svg").on("click", biPartite.mouseout)
		  
	}
	biPartite.data = function(_){
	  return !arguments.length ? data : (data = _, refresh=true, biPartite);
	}
	biPartite.fill = function(_){
	  return arguments.length ? (fill = _, refresh=true, biPartite) 
		  : fill || (fill=function(){var color = d3.scaleOrdinal(d3.schemeCategory10);  return function(d){ return color(d.primary);}}());		
	}
	biPartite.keyPrimary = function(_){ 
	  return arguments.length ? (keyPrimary = _, refresh=true, biPartite) : keyPrimary || (keyPrimary=function(d){ return d[0] });
	}
	biPartite.sortPrimary = function(_){ 
	  return arguments.length ? (sortPrimary = _, refresh=true, biPartite) : sortPrimary || (sortPrimary=d3.ascending) ;
	}
	biPartite.keySecondary = function(_){ 
	  return arguments.length ? (keySecondary = _, refresh=true, biPartite) : keySecondary||(keySecondary=function(d){ return d[1] });
	}
	biPartite.sortSecondary = function(_){ 
	  return arguments.length ? (sortSecondary = _, refresh=true, biPartite) : sortSecondary || (sortSecondary=d3.ascending);	
	}	  
	biPartite.value = function(_){ 
	  return arguments.length ? (value = _, refresh=true, biPartite) : value || (value=function(d){ return d[2] });
	}	  
	biPartite.width = function(_){
	  return arguments.length ? (width = _, refresh=true, biPartite) : width || (width=(biPartite.orient()=="vertical" ? 400: 600));
	}
	biPartite.height = function(_){
	  return arguments.length ? (height = _, refresh=true, biPartite) : height|| (height=(biPartite.orient()=="vertical" ? 600: 400));
	}
	biPartite.barSize = function(_){
	  return arguments.length ? (barSize = _, refresh=true, biPartite) : barSize || (barSize=35);
	}
	biPartite.min = function(_){
	  return arguments.length ? (min = _, refresh=true, biPartite) : typeof min=="undefined" ? (min=0): min;
	}
	biPartite.orient = function(_){
	  return arguments.length ? (orient = _, refresh=true, biPartite) : typeof orient=="undefined" ? (orient="vertical"):orient;
	}
	biPartite.pad = function(_){
	  return arguments.length ? (pad = _, refresh=true, biPartite) : typeof pad=="undefined" ? (pad=1): pad;
	}
	biPartite.duration = function(_){
	  return arguments.length ? (duration = _, refresh=true, biPartite) : typeof duration=="undefined" ? (duration=500):duration;
	}
	biPartite.edgeOpacity = function(_){
	  return arguments.length ? (edgeOpacity = _, refresh=true, biPartite) : typeof edgeOpacity=="undefined" ? (edgeOpacity=.4):edgeOpacity;
	}
	biPartite.edgeMode = function(_){
	  return arguments.length ? (edgeMode = _, refresh=true, biPartite) : edgeMode || (edgeMode="curved");
	}
	biPartite.bars = function(mb){
	  var mainBars={primary:[], secondary:[]};
	  var subBars= {primary:[], secondary:[]};
	  var key ={primary:biPartite.keyPrimary(), secondary:biPartite.keySecondary() };
	  var _or = biPartite.orient();
	  
	  calculateMainBars("primary");
	  calculateMainBars("secondary");	
	  calculateSubBars("primary");	
	  calculateSubBars("secondary");
	  floorMainBars(); // ensure that main bars is atleast of size mi.n
	  
	  return {
		   mainBars:mainBars.primary.concat(mainBars.secondary)
		  ,subBars:subBars.primary.concat(subBars.secondary)
		  ,edges:calculateEdges()
	  };

	  function isSelKey(d, part){ 
		  return (typeof mb === "undefined" || mb.part === part) || (key[mb.part](d) === mb.key);
	  }
	  function floorMainBars(){
		  var m =biPartite.min()/2;
		  
		  mainBars.primary.forEach(function(d){
			  if(d.height<m) d.height=m;
		  });
		  mainBars.secondary.forEach(function(d){
			  if(d.height<m) d.height=m;
		  });
	  }
	  function calculateMainBars(part){
		  function v(d){ return isSelKey(d, part) ? biPartite.value()(d): 0;}

		  var ps = d3.nest()
			  .key(part=="primary"? biPartite.keyPrimary():biPartite.keySecondary())
			  .sortKeys(part=="primary"? biPartite.sortPrimary():biPartite.sortSecondary())
			  .rollup(function(d){ return d3.sum(d,v); })
			  .entries(data)
		  
		  var bars = bpmap(ps, biPartite.pad(), biPartite.min(), 0, _or=="vertical" ? biPartite.height() : biPartite.width())
		  var bsize = biPartite.barSize()
		  ps.forEach(function(d,i){ 
			  mainBars[part].push({
				   x:_or=="horizontal"? (bars[i].s+bars[i].e)/2 : (part=="primary" ? bsize/2 : biPartite.width()-bsize/2)
				  ,y:_or=="vertical"? (bars[i].s+bars[i].e)/2 : (part=="primary" ? bsize/2 : biPartite.height()-bsize/2)
				  ,height:_or=="vertical"? (bars[i].e - bars[i].s)/2 : bsize/2
				  ,width: _or=="horizontal"? (bars[i].e - bars[i].s)/2 : bsize/2
				  ,part:part
				  ,key:d.key
				  ,value:d.value
				  ,percent:bars[i].p
			  });
		  });
	  }
	  function calculateSubBars(part){
		  function v(d){ return isSelKey(d, part) ? biPartite.value()(d): 0;};
		  
		  var sort = part=="primary"
				  ? function(a,b){ return biPartite.sortPrimary()(a.key, b.key);}
				  : function(a,b){ return biPartite.sortSecondary()(a.key, b.key);}
				  
		  var map = d3.map(mainBars[part], function(d){ return d.key});
		  
		  var ps = d3.nest()
			  .key(part=="primary"? biPartite.keyPrimary():biPartite.keySecondary())
			  .sortKeys(part=="primary"? biPartite.sortPrimary():biPartite.sortSecondary())
			  .key(part=="secondary"? biPartite.keyPrimary():biPartite.keySecondary())
			  .sortKeys(part=="secondary"? biPartite.sortPrimary():biPartite.sortSecondary())
			  .rollup(function(d){ return d3.sum(d,v); })
			  .entries(biPartite.data());
  
		  ps.forEach(function(d){ 
			  var g= map.get(d.key); 
			  var bars = bpmap(d.values, 0, 0
					  ,_or=="vertical" ? g.y-g.height : g.x-g.width
					  ,_or=="vertical" ? g.y+g.height : g.x+g.width);

			  var bsize = biPartite.barSize();			
			  d.values.forEach(function(t,i){ 
				  subBars[part].push({
					   x:_or=="vertical"? part=="primary" ? bsize/2 : biPartite.width()-bsize/2 : (bars[i].s+bars[i].e)/2
					  ,y:_or=="horizontal"? part=="primary" ? bsize/2 : biPartite.height()-bsize/2 : (bars[i].s+bars[i].e)/2
					  ,height:(_or=="vertical"? bars[i].e - bars[i].s : bsize)/2
					  ,width: (_or=="horizontal"? bars[i].e - bars[i].s : bsize)/2
					  ,part:part
					  ,primary:part=="primary"? d.key : t.key
					  ,secondary:part=="primary"? t.key : d.key	
					  ,value:t.value
					  ,percent:bars[i].p*g.percent
					  ,index: part=="primary"? d.key+"|"+t.key : t.key+"|"+d.key //index 
				  });
			  });		  
		  });
	  }
	  function calculateEdges(){	
		  var map=d3.map(subBars.secondary,function(d){ return d.index;});
		  var eMode= biPartite.edgeMode();
		  
		  return subBars.primary.map(function(d){
			  var g=map.get(d.index);
			  return {
				   path:_or === "vertical" 
					  ? edgeVert(d.x+d.width,d.y+d.height,g.x-g.width,g.y+g.height,g.x-g.width,g.y-g.height,d.x+d.width,d.y-d.height)
					  : edgeHoriz(d.x-d.width,d.y+d.height,g.x-g.width,g.y-g.height,g.x+g.width,g.y-g.height,d.x+d.width,d.y+d.height)
				  ,primary:d.primary
				  ,secondary:d.secondary
				  ,value:d.value
				  ,percent:d.percent
			  }
		  });
		  function edgeVert(x1,y1,x2,y2,x3,y3,x4,y4){
			  if(eMode=="straight") return ["M",x1,",",y1,"L",x2,",",y2,"L",x3,",",y3,"L",x4,",",y4,"z"].join("")
			  var mx1=(x1+x2)/2,mx3=(x3+x4)/2;
			  return ["M",x1,",",y1,"C",mx1,",",y1," ",mx1,",",y2,",",x2,",",y2,"L"
					  ,x3,",",y3,"C",mx3,",",y3," ",mx3,",",y4,",",x4,",",y4,"z"].join("");
		  }
		  function edgeHoriz(x1,y1,x2,y2,x3,y3,x4,y4){
			  if(eMode=="straight") return ["M",x1,",",y1,"L",x2,",",y2,"L",x3,",",y3,"L",x4,",",y4,"z"].join("")
			  var my1=(y1+y2)/2,my3=(y3+y4)/2;
			  return ["M",x1,",",y1,"C",x1,",",my1," ",x2,",",my1,",",x2,",",y2,"L"
					  ,x3,",",y3,"C",x3,",",my3," ",x4,",",my3,",",x4,",",y4,"z"].join("");
		  }
	  }
	  function bpmap(a/*array*/, p/*pad*/, m/*min*/, s/*start*/, e/*end*/){
		  var r = m/(e-s-2*a.length*p); // cut-off for ratios
		  var ln =0, lp=0, t=d3.sum(a,function(d){ return d.value;}); // left over count and percent.
		  a.forEach(function(d){ if(d.value < r*t ){ ln+=1; lp+=d.value; }})
		  var o= t < 1e-5 ? 0:(e-s-2*a.length*p-ln*m)/(t-lp); // scaling factor for percent.
		  var b=s, ret=[];
		  a.forEach(function(d){ 
			  var v =d.value*o; 
			  ret.push({
				   s:b+p+(v<m?.5*(m-v): 0)
				  ,e:b+p+(v<m? .5*(m+v):v)
				  ,p:t < 1e-5? 0:d.value/t
			  }); 
			  b+=2*p+(v<m? m:v); 
		  });	
		  return ret;
	  }
	}	  
	biPartite.update = function(_data){
	  data = _data;
	  updateLocals()

	  bars = biPartite.bars()
	  
	  sel.selectAll(".viz-biPartite-subBar")
		  .data(bars.subBars)
		  .transition()
		  .duration(duration)
		  .attr("transform", function(d){ return "translate("+d.x+","+d.y+")";})
		  .select("rect")
		  .attr("x",fx)
		  .attr("y",fy)
		  .attr("width",fw)
		  .attr("height",fh);
					   
	  sel.selectAll(".viz-biPartite-edge")
		  .data(bars.edges)
		  .transition()
		  .duration(duration)
		  .attr("d",function(d){ return d.path; })
		  .style("fill-opacity",biPartite.edgeOpacity())
		   
	  sel.selectAll(".viz-biPartite-mainBar")
		  .data(bars.mainBars)
		  .transition()
		  .duration(duration)
		  .attr("transform", function(d){ return "translate("+d.x+","+d.y+")";})
		  .select("rect")
		  .attr("x",fx)
		  .attr("y",fy)
		  .attr("width",fw)
		  .attr("height",fh)
		  .style("fill-opacity",0)
		  
	  return biPartite
	}
	biPartite.mouseover = function(d){

	  d3.event.stopPropagation()

		var newbars = biPartite.bars(d)
		
		// update bar data
		const b = sel.selectAll(".viz-biPartite-mainBar")
		  .data(newbars.mainBars)

		// fade not selected
		b.filter(r => (r.part === d.part && r.key !== d.key) || r.height === 0)
		  .transition()
		  .duration(biPartite.duration())
		  .attr("opacity", 0.1)

		  // highlight selected
		b.filter(r => !((r.part === d.part && r.key !== d.key) || r.height === 0))
		  .transition()
		  .duration(biPartite.duration())
		  .attr("opacity", 1)
		  
		var e = sel.selectAll(".viz-biPartite-edge")
		  .data(newbars.edges)
		  
		  // selected edges
		e.filter(function(t){ return t[d.part] === d.key;})
		  .transition()
		  .duration(biPartite.duration())
		  .style("fill-opacity",1)
		  
		  // not selected edges
		e.filter(function(t){ return t[d.part] !== d.key;})
		  .transition()
		  .duration(biPartite.duration())
		  .style("fill-opacity",0.05)
	  
	  }

	biPartite.mouseout = function(d){
		
		sel.selectAll(".viz-biPartite-subBar")
		  .data(bars.subBars)
		  .transition()
		  .duration(biPartite.duration())
		  .attr("transform", function(d){ return "translate("+d.x+","+d.y+")";})
		  .select("rect")
		  .attr("x",fx)
		  .attr("y",fy)
		  .attr("width",fw)
		  .attr("height",fh)
		  
		sel.selectAll(".viz-biPartite-edge")
		  .data(bars.edges)
		  .transition()
		  .duration(biPartite.duration())
		  .style("fill-opacity",biPartite.edgeOpacity())
		  .attr("d",function(d){ return d.path})
		  
		sel.selectAll(".viz-biPartite-mainBar")
		  .data(bars.mainBars)
		  .transition()
		  .duration(biPartite.duration())
		  .attr("opacity", 1)
	  }
	function updateLocals(){
	  if(!refresh) return;
	  biPartite.fill();
	  biPartite.keyPrimary();
	  biPartite.sortPrimary();
	  biPartite.keySecondary();
	  biPartite.sortSecondary();
	  biPartite.value();
	  biPartite.width();	
	  biPartite.height();	
	  biPartite.barSize();		
	  biPartite.min();		
	  biPartite.orient();		
	  biPartite.pad();		
	  biPartite.duration();		
	  biPartite.edgeOpacity();		
	  biPartite.edgeMode();
	  refresh=false;
	}
	function fx(d){ return -d.width}
	function fy(d){ return -d.height}
	function fw(d){ return 2*d.width}
	function fh(d){ return 2*d.height}
	
	return biPartite;
  }
  this.viz=viz;
}();
