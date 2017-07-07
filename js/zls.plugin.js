/*!
 * 
 * Javascript jQuery plugin
 * Author: Albert Xiao
 * Version: 1.0.0
 * Date: 2017-04-27 UTC 17:52
 * 
 * ECMAScript 6
 * 
 */
(function($) {
    "use strict"
    /**
     * declare the panel object parameter
     * 
     */
    //--------------------------------------------------------------------------------------------------------------------
    const history=5;
    var defaultColor = '#FF0000';
    var colorJSON = [{ color: '#FF0000' }, { color: '#00FF00' }, { color: '#0000FF' },{color: '#FFC90E'}, { color: '#000000' }, { color: '#FFFFFF' }];
    var btnGraphJSON={
        $btnLine:{obj:null,code:'&#xe604;',info:'直线'},
        $btnArrow:{obj:null,code:'&#xe600;',info:'箭头线'},
        $btnText:{obj:null,code:'&nbsp;t&nbsp;',info:'文本'},
        $btnRect:{obj:null,code:'&#xe783;',info:'矩形'},
        $btnEllipse:{obj:null,code:'&#xe781;',info:'圆形'}
    };
    var btnFileJSON={
        $btnZoomIn:{obj:null,code:'&#xe60a;',info:'放大'},
        $btnZoomOut:{obj:null,code:'&#xe60b;',info:'缩小'},
        $btnLastSetp:{obj:null,code:'&#xe608;',info:'上一步'},
        $btnNextStep:{obj:null,code:'&#xe609;',info:'下一步'},
        $btnSave:{obj:null,code:'&#xe602;',info:'保存图片'},
        $btnReset:{obj:null,code:'&#xe606;',info:'重置'},
        $btnShare:{obj:null,code:'&#xe607;',info:'分享'},
    };
    //--------------------------------------------------------------------------------------------------------------------

    /**
     * declare globle variables and json object
     * 
     */
    // define the Father Container
    var $container;
    //define the color array
    var $color;
    //define the layer
    var $firstLayer;
    var $layers = new Array();
    var $hisLayers = new Array();
    //define the context object of canvas
    var $ctx;
    //define the size of drawing panel
    var $cavHeight;
    var $cavWidth;
    //define the path constant
    var $path;
    //define the color bottons
    var $selectColor;
    //define info div
    var $info;
    /** 
     * define all the componets
     * 
     */
    //initialization function
    $.fn.init_ZLSP = function(path) {
        $path = path;
        if (this.get(0).tagName === 'DIV') {
            $container = this;
            _init_Parameters(path, this);
        } else {
            let e = new Error();
            e.message = 'the container is not a element named "div"';
            e.name = 'def_error';
            throw e;
        }
        return this;
    };
    //reload function
    $.fn.reload_ZLSP = function() {
            if (this === $container) {
                this.empty();
                if($info!=null){
                    $info.remove();
                }
                $layers.splice(0,$layers.length);
                this.init_ZLSP($path);
            }
        }
        //initialize the original image
    var _init_oimage = (path) => {
            let $oraginal_img = new Image();
            $oraginal_img.src = path;
            return $oraginal_img;
        }
        //initialize the parameters
    var _init_Parameters = (imgPath, obj) => {
        let $img = _init_oimage(imgPath);
        let $canvas = canvasFactory(obj);
        let $tp = _init_TP(obj);
        $ctx = $canvas.getContext('2d');
        $img.onload = () => {
            $ctx.drawImage($img, 2, 2);
        }
        $firstLayer = $canvas;
        obj.append($canvas);
        obj.append($tp);
        //Next Step Button;
        if(btnFileJSON.$btnNextStep!=null){
            btnFileJSON.$btnNextStep.obj.className='iconfont iconfont-back-drop';
            btnFileJSON.$btnNextStep.obj.onclick=function(){
                if($hisLayers.length>0){
                    let cav=$hisLayers.splice($hisLayers.length-1,1);
                    $layers.splice($layers.length-1,1);
                    let tcav=cav[0];
                    $layers.push(tcav[0]);
                    $container.append(tcav);
                    for(let key in btnGraphJSON){
                        if(btnGraphJSON[key].obj.className==='iconfont iconfont-back-selected'){
                            createLayer(btnGraphJSON[key].obj,$container);
                        };
                    };
                    if($hisLayers.length<=0){
                        btnFileJSON.$btnNextStep.obj.className='iconfont iconfont-back-drop';
                    }
                }
            };
        };
        //Last Step Button;
        if(btnFileJSON.$btnLastSetp!=null){
            btnFileJSON.$btnLastSetp.obj.className='iconfont iconfont-back-drop';
            btnFileJSON.$btnLastSetp.obj.onclick=function(){
                if($layers.length>0){
                    let flag=false;
                    if($layers.length<=2){
                        flag=true;
                    }
                    let cav=$layers.splice($layers.length-1,1);
                    cav[0].remove();
                    if($layers.length>0){
                        let cav=$layers.splice($layers.length-1,1);
                        cav[0].remove();
                        $hisLayers.push(cav);
                    }
                    btnFileJSON.$btnNextStep.obj.className='iconfont iconfont-back';
                    for(let key in btnGraphJSON){
                        if(btnGraphJSON[key].obj.className==='iconfont iconfont-back-selected'){
                            createLayer(btnGraphJSON[key].obj,$container);
                        };
                    };
                    if(flag){
                        btnFileJSON.$btnLastSetp.obj.className='iconfont iconfont-back-drop'
                    }
                }
            };
        };
        //reset button
        if(btnFileJSON.$btnReset!=null){
            btnFileJSON.$btnReset.obj.onclick = function() {
                $container.reload_ZLSP();
            }
        };
        //Save File Button
        if(btnFileJSON.$btnSave!=null){
            btnFileJSON.$btnSave.obj.onclick = function() {
                for(let i in $layers){
                    let ctx=$firstLayer.getContext('2d');
                    ctx.drawImage($layers[i],0,0);
                }
                let imgData=$firstLayer.toDataURL('png');
                imgData = imgData.replace('image/png','image/octet-stream');
                let save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
                save_link.href = imgData;
                save_link.download = 'case'+Date.parse(new Date())+'.png';
                var event = document.createEvent('MouseEvents');
                event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                save_link.dispatchEvent(event);
            }
        };
        //Zoom-In Button
        if(btnFileJSON.$btnZoomIn.obj!=null){
            btnFileJSON.$btnZoomIn.obj.onclick=function(){
                
            };
        };
        //Zoom-Out Button
        if(btnFileJSON.$btnZoomOut.obj!=null){
            btnFileJSON.$btnZoomOut.obj.onclick=function(){};
        };
    };
    //initialize the canvas
    var canvasFactory = (obj) => {
        let $canvas = document.createElement('canvas');
        _init_size_canvas(obj);
        $canvas.width = $cavWidth;
        $canvas.height = $cavHeight;
        $canvas.style.position = 'absolute';
        $canvas.style.borderRadius = '2px';
        $canvas.style.top = '81px';
        return $canvas;
    };
    //init the size of canvas
    var _init_size_canvas = (obj) => {
        if (obj != null && obj.height() != 0) {
            $cavHeight = obj.height()-70;
            $cavWidth = obj.width();
        } else {
            $cavHeight = document.body.clientHeight * 0.8;
            $cavWidth = document.body.clientWidth * 0.8;
        }
    };
    //initialize the tool panel
    var _init_TP = (obj) => {
        let tp = document.createElement('div');
        tp.style.position = 'absolute';
        tp.style.cssFloat = 'left';
        tp.style.backgroundColor = '#CCD6E5';
        tp.style.height = '70px';
        tp.style.width = ($cavWidth - 10).toString() + 'px';
        tp.style.boxShadow = '0 2px 2px #555';
        tp.style.padding = '5px';
        let cp = _init_CP();
        let gp = _init_GP(obj);
        let fp = _init_FP();
        tp.append(cp);
        tp.append(gp);
        tp.append(fp);
        return tp;
    };
    //initialize the color
    var _init_Color = () => {
        let elements = new Array();
        for (let i in colorJSON) {
            let btn = iTagFactory('&nbsp;&nbsp;&nbsp;', colorJSON[i].color);
            btn.className = 'iconfont';
            btn.style.backgroundColor = colorJSON[i].color;
            elements.push(btn);
        };
        return elements;
    };
    //initialize the color palette
    var _init_CP = () => {
        let cp = _init_Pannel((($cavWidth - 30) / 3 - 15).toString() + 'px', '60px');
        cp.style.padding = '5px';
        cp.style.borderLeft = '1px solid #AEAEAE';
        let elements = _init_Color();
        let table = tableFactory(2, Math.ceil(elements.length / 2), elements);
        table.style.cssFloat='left';
        $selectColor = iTagFactory('&nbsp;&nbsp;&nbsp;', '当前颜色');
        $selectColor.className = 'iconfont';
        $selectColor.style.backgroundColor = defaultColor;
        table.style.marginRight='10px';
        cp.append(table);
        let cont=document.createElement('center');
        cont.style.display='table-cell';
        cont.style.verticalAlign='middle';
        cont.style.paddingLeft='10px';
        cont.style.height='60px';
        cont.append($selectColor);
        cont.style.borderLeft='1px solid #AEAEAE';
        cont.append(document.createElement('br'));
        cp.append(cont);
        selectColorListener(elements);
        return cp;
    };
    //initialize the graph panel buttons
    var _init_btns = (btns) => {
        let elements = new Array();
        for(let key in btns){
            btns[key].obj=iTagFactory(btns[key].code,btns[key].info);
            elements.push(btns[key].obj);
        };
        return elements;
    };
    //initialize the graph panel
    var _init_GP = (obj) => {
        let gp = _init_Pannel((($cavWidth - 30) / 3 - 15).toString() + 'px', '60px');
        gp.style.padding = '5px';
        gp.style.borderLeft = '1px solid #AEAEAE';
        let elements=new Array();
        elements=_init_btns(btnGraphJSON);
        selectGraphListener(elements, obj);
        let table = tableFactory(2, 3, elements);
        gp.append(table);
        return gp;
    };
    //initialize the file panel
    var _init_FP = () => {
            let fp = _init_Pannel((($cavWidth - 30) / 3 - 15).toString() + 'px', '60px');
            fp.style.padding = '5px';
            fp.style.borderLeft = '1px solid #AEAEAE';
            let elements=new Array();
            elements=_init_btns(btnFileJSON);
            let table = tableFactory(2, 3, elements);
            fp.append(table);
            return fp;
        }
        // the factory of i tag
    var iTagFactory = (unicode, name) => {
            let iTag = document.createElement('i');
            iTag.className = 'iconfont iconfont-back';
            iTag.innerHTML = unicode;
            iTag.name = name;
            onInfoListener(iTag);
            return iTag
        }
        //initialize the normal panel
    var _init_Pannel = (width, height) => {
        let pannel = document.createElement('div');
        pannel.style.width = width;
        pannel.style.cssFloat='left';
        pannel.style.backgroundColor = 'rgba(255,255,255,0)';
        pannel.style.height = height;
        return pannel;
    };
    var tableFactory = (row, col, elements) => {
        let table = document.createElement('table');
        for (let i = 1; i <= row; i++) {
            let tr = document.createElement('tr');
            for (let j = 1; j <= col; j++) {
                let td = document.createElement('td');
                let temp = (i - 1) * col + j - 1;
                if (temp < elements.length) {
                    td.append(elements[temp]);
                }
                tr.append(td);
            };
            table.append(tr);
        };
        table.cellSpacing = '2px';
        return table;
    };
    var onInfoListener = (obj) => {
        obj.onmouseover = function(e) {
            let x = e.pageX;
            let y = e.pageY;
            $info = document.createElement('div');
            $info.style.textAlign = 'center';
            $info.innerText = obj.name;
            $info.style.position = 'absolute';
            $info.style.top = y - 25 + 'px';
            $info.style.left = x - 10 + 'px';
            $info.style.background = 'radial-gradient(#FFF,#DADADA)';
            $info.style.border = '1px solid #999';
            $info.style.padding = '2px';
            $info.style.fontSize = '8px';
            $info.style.borderRadius = '3px';
            document.getElementsByTagName('body')[0].append($info);
        };
        obj.onmouseout = function(e) {
            $info.remove();
        };
    };
    var selectColorListener = (elements) => {
        for (let i in elements) {
            elements[i].onclick = function() {
                $selectColor.style.backgroundColor = elements[i].name;
            };
        };
    };
    var selectGraphListener = (elements, container) => {
        for (let i in elements) {
            elements[i].onclick = function() {
                for (let j in elements) {
                    elements[j].className = 'iconfont iconfont-back';
                };
                if($layers.length>1){
                    let cav=$layers.pop();
                    cav.remove();
                    console.log($layers.length)
                };
                createLayer(this, container);
            };
        }
    };
    var createLayer = (graph, container) => {
        let canvas = canvasFactory(container);
        if($layers.length>=history){
            let ctx=$firstLayer.getContext('2d');
            ctx.drawImage($layers.shift(),0,0);
        }
        $layers.push(canvas);
        btnFileJSON.$btnLastSetp.obj.className='iconfont iconfont-back';
        $ctx = canvas.getContext('2d');
        container.append(canvas);
        if(graph!=null){
            canvasListener(canvas, graph, container);
            graph.className = 'iconfont iconfont-back-selected';
        }
    };
    var canvasListener = (canvas, graph, container) => {
        canvas.onmousedown = function(e) {
            if (e.button == 0) {
                let position = getCanvasLocation(canvas, e);
                if($hisLayers.length>0){
                    $hisLayers.splice(0,$hisLayers.length);
                    btnFileJSON.$btnNextStep.obj.className='iconfont iconfont-back-drop';
                }
                if (graph.name === '直线') {
                    drawStraightLine(canvas, position, graph, container, false);
                }else if(graph.name === '箭头线'){
                    drawStraightLine(canvas, position, graph, container, true);
                }else if(graph.name === '圆形'){
                    drawEllipse(canvas, position , graph,container);
                }else if(graph.name === '矩形'){
                    drawRect(canvas, position , graph,container);
                }else if(graph.name === '文本'){
                    drawText(canvas, position , graph,container);
                }
            };
        };
    };
    var getCanvasLocation = (canvas, e) => {
        let rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left * (canvas.width / rect.width),
            y: e.clientY - rect.top * (canvas.height / rect.height)
        };
    };
    var drawStraightLine = (canvas, position, graph, container, isArrow) => {
        canvas.onmousemove = function(e) {
            $ctx.clearRect(0, 0, canvas.width, canvas.height);
            $ctx.strokeStyle = $selectColor.style.backgroundColor;
            $ctx.lineWidth = 2;
            $ctx.lineCap = 'square';
            $ctx.beginPath();
            $ctx.moveTo(position.x, position.y);
            let pos = getCanvasLocation(canvas, e);
            $ctx.lineTo(pos.x, pos.y);
            if (isArrow) {
                let tp=cavTrans(position,pos);
                let angle=getAmplitude(tp);
                let a1=angle-Math.PI/6;
                let a2=angle+Math.PI/6;
                let p1={x:10*Math.cos(a1),y:10*Math.sin(a1)};
                let p2={x:10*Math.cos(a2),y:10*Math.sin(a2)};
                let np1=cavInverseTrans(p1,pos);
                let np2=cavInverseTrans(p2,pos);
                $ctx.moveTo(pos.x,pos.y);
                $ctx.lineTo(np1.x, np1.y);
                $ctx.moveTo(pos.x,pos.y);
                $ctx.lineTo(np2.x, np2.y);
            }
            $ctx.stroke();
            $ctx.closePath();
        }
        canvas.onmouseup = function() {
            canvas.onmousemove = function() {};
            createLayer(graph, container);
        };
    };
    var drawEllipse = (canvas, position , graph,container)=>{
        canvas.onmousemove = function(e) {
            $ctx.clearRect(0, 0, canvas.width, canvas.height);
            $ctx.strokeStyle = $selectColor.style.backgroundColor;
            $ctx.lineWidth = 2;
            let pos = getCanvasLocation(canvas, e);
            let a=(pos.x-position.x)/2;//horizontal axis of ellipse
            let b=(pos.y-position.y)/2;//vartical axis of ellipse
            let center={x:position.x+a,y:position.y+b};
            $ctx.beginPath();
            let st=cavInverseTrans(paramEqEllipse(Math.abs(a),Math.abs(b),0),center);
            $ctx.moveTo(st.x,st.y);
            for(let i=0;i<=2*Math.PI;i+=0.05){
                let point=cavInverseTrans(paramEqEllipse(Math.abs(a),Math.abs(b),i),center);
                $ctx.lineTo(point.x,point.y);
            }
            $ctx.lineTo(st.x,st.y);
            $ctx.stroke();
            $ctx.closePath();
        }
        canvas.onmouseup = function() {
            canvas.onmousemove = function() {};
            createLayer(graph, container);
        };
    };
    var drawRect = (canvas, position , graph,container) => {
        canvas.onmousemove = function(e) {
            $ctx.clearRect(0, 0, canvas.width, canvas.height);
            $ctx.strokeStyle = $selectColor.style.backgroundColor;
            $ctx.lineWidth = 2;
            let pos = getCanvasLocation(canvas, e);
            let a=(pos.x-position.x);
            let b=(pos.y-position.y);
            $ctx.strokeRect(position.x,position.y,a,b);
            $ctx.closePath();
        }
        canvas.onmouseup = function() {
            canvas.onmousemove = function() {};
            createLayer(graph, container);
        };
    };
    var drawText = (canvas, position , graph,container) => {
        let input=document.createElement('input');
        let pos;
        canvas.onmousemove = function(e) {
            $ctx.clearRect(0, 0, canvas.width, canvas.height);
            $ctx.strokeStyle = '#AAA';
            $ctx.lineWidth = 0.5;
            pos = getCanvasLocation(canvas, e);
            let a=(pos.x-position.x);
            let b=(pos.y-position.y);
            $ctx.strokeRect(position.x,position.y,a,b);
            $ctx.closePath();
        }
        canvas.onmouseup=function(e){
            canvas.onmousemove = function() {};
            $info=document.createElement('div');
            let a=Math.abs(pos.x-position.x);
            input.style.width=a-3+'px';
            $info.append(input);
            $info.style.position = 'absolute';
            $info.style.top =position.y+70+ 'px';
            $info.style.left =position.x + 'px';
            container.append($info);
            input.focus();
        };
        input.onblur=function(){
            $ctx.clearRect(0, 0, canvas.width, canvas.height);
            let a=Math.abs(pos.x-position.x);
            $ctx.fontSize='14px';
            $ctx.fillStyle = $selectColor.style.backgroundColor;
            let content=input.value;
            let wLength=Math.floor(a/14);
            for(let i=0;i<Math.ceil(content.length/wLength);i++){
                $ctx.fillText(content.substr(i*wLength,wLength),position.x,position.y+(i+1)*16);
            }
            input.remove();
            $info.remove();
            createLayer(graph, container);
        };
    };
    //parametric equation of ellipse
    var paramEqEllipse = (a,b,alpha) => {
        return {x:a*Math.cos(alpha),y:b*Math.sin(alpha)};
    };
    //transformation of canvas coordinate
    var cavTrans=(pos,deltap)=>{
        let px=pos.x-deltap.x;
        let py=deltap.y-pos.y;
        return{x:px,y:py};
    };
    //inverse-transformation of canvas coordinate
    var cavInverseTrans=(pos,deltap)=>{
        let px=pos.x+deltap.x;
        let py=deltap.y-pos.y;
        return{x:px,y:py};
    };
    var getAmplitude=(position)=>{
        let radius=Math.sqrt(Math.pow(position.x,2)+Math.pow(position.y,2));
        let preAngle=Math.asin(position.y/radius);
        let angle;
        if(position.x>0){
            angle=preAngle;
        }else if(position.x<0){
            if(position.y>0){
                angle=Math.PI-preAngle;
            }else{
                angle=-Math.PI-preAngle;
            }
        }else{
            if(position.y>0){
                angle=Math.PI/2;
            }else{
                angle=-Math.PI/2;
            }
        }
        return angle;
    };
    /**
     * load file first
     * Event listener
     * 
     */
    $(() => {
        //Load css file
        let cssNode = document.createElement('link');
        cssNode.href = 'css/iconfont.css';
        cssNode.rel = 'stylesheet';
        document.getElementsByTagName('head')[0].appendChild(cssNode);
        //window resize;
        $(window).resize(() => {
            $container.reload_ZLSP();
        });
    });
})(jQuery)