function RandomPoints(numpoint,width,height){
    let points=[];
    for(let i=0;i<numpoint*3;i+=3){
        points.push(Math.random()*width); //x
        points.push(Math.random()*height); //y
        points.push(Math.random()); //m
    }

    return points;
}

function RandomPoints_CTX(numpoint,width,height){
    let points=[];
    for(let i=0;i<numpoint;i++){
        points.push({
            x:Math.random()*width,
            y:Math.random()*height,
            z:Math.random()
        });
    }

    points[numpoint-1].z=1;

    return points;
}