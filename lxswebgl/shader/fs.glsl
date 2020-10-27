#version 300 es
precision mediump float;
uniform vec3 points[300];

//存储最近的点的索引，和距离
struct DirectionalLight {
  int idx;
  float dist;
};

DirectionalLight queues[2];

out vec4 outcolor;

//更新队列，
void updatequeue(int idx,float dist){
    if(dist<queues[0].dist){
        queues[1]=queues[0];
        queues[0].idx=idx;
        queues[0].dist=dist;
    }else if(dist<queues[1].dist){
        queues[1].idx=idx;
        queues[1].dist=dist;
    }
}

float getCoorddist(vec2 coord,vec2 point){
    float dertx=coord.x-point.x;
    float derty=coord.y-point.y;
    return dertx*dertx+derty*derty;
}

float getCoordColor(vec2 coord){
    //前两个点位的距离更新到queues
    float dist0=getCoorddist(coord,points[0].xy);
    float dist1=getCoorddist(coord,points[1].xy);
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

    for(int i=2;i<300;i++){
        float dist=getCoorddist(coord,points[i].xy);
        updatequeue(i,dist);
    }

    //idw
    float denominator=(1.0/queues[0].dist)+(1.0/queues[1].dist);
    float numerator1=points[queues[0].idx].z*(1.0/queues[0].dist)/denominator;
    float numerator2=points[queues[1].idx].z*(1.0/queues[1].dist)/denominator;

    return numerator1+numerator2;
}

void main(){
    float color=getCoordColor(gl_FragCoord.xy);

    outcolor=vec4(vec3(color),1.0);
}
