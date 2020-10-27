var points=[];
var queues=[];

function updatequeue(idx,dist){
    if(dist<queues[0].dist){
        queues[1]=queues[0];
        queues[0].idx=idx;
        queues[0].dist=dist;
    }else if(dist<queues[1].dist){
        queues[1].idx=idx;
        queues[1].dist=dist;
    }
}

function getcoorddist(coord,point){
    let dertx=coord.x-point.x;
    let derty=coord.y-point.y;
    return dertx*dertx+derty*derty;
}

function getcoordcolor(coord){
    queues[0]={idx:-1,dist:999};
    queues[1]={idx:-1,dist:999};

    let dist0=getcoorddist(coord,points[0]);
    let dist1=getcoorddist(coord,points[1]);
    if(dist0<dist1){
        queues[0].idx=0;
        queues[0].dist=dist0;
        queues[1].idx=1;
        queues[1].dist=dist1;
    }else{
        queues[0].idx=1;
        queues[0].dist=dist1;
        queues[1].idx=0;
        queues[1].dist=dist0;
    }

    for(let i=2;i<points.length;i++){
        let dist=getcoorddist(coord,points[i]);
        updatequeue(i,dist);
    }

    //idw
    let denominator=(1.0/queues[0].dist)+(1.0/queues[1].dist);
    let numerator1=points[queues[0].idx].z*(1.0/queues[0].dist)/denominator;
    let numerator2=points[queues[1].idx].z*(1.0/queues[1].dist)/denominator;
    let result=numerator1+numerator2;
    return result*255;
}

function outputcolor(width,height){
    points=RandomPoints_CTX(300,width,height);
    let imagedata=[];
    for(let row=0;row<height;row++){
        for(let col=0;col<width;col++){
            let r=Math.round(getcoordcolor({x:row,y:col}));
            imagedata.push(r);
            imagedata.push(r);
            imagedata.push(r);
            imagedata.push(255);
        }
    }
    return imagedata;
}