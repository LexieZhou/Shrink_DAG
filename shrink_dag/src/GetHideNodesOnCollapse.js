import { uniq, cloneDeep } from 'lodash';

export const getHideNodesOnCollapse = (edges, startNodeId) => {
  console.log('id:', startNodeId);
  const toHideNodeIds = []; //要隐藏的点
  const toHideEdges = []; //要隐藏的边

  const inEdges = new Map(); //每个点的入度存储
  edges.forEach((edge) => {
    const edgeSource = edge.source;
    const edgeTarget = edge.target;
    const currentInEdges = inEdges.get(edgeTarget) || [];
    currentInEdges.push(edgeSource);
    inEdges.set(edgeTarget, uniq(currentInEdges));
  });

  const outEdges = new Map(); //每个点的出度
  edges.forEach((edge) => {
    const edgeSource = edge.source;
    const edgeTarget = edge.target;
    const currentTargets = outEdges.get(edgeSource) || [];
    currentTargets.push(edgeTarget);
    outEdges.set(edgeSource, uniq(currentTargets));
  });
  // console.log('inEdges:', inEdges);
  // console.log('outEdges:', outEdges);

  
  
  const signalCountMap = new Map(); //用于记录每个点要删除的次数
  //const startNodeOutNodes = outEdges.get(startNodeId) || []; //记录目标节点的出度节点
  let startNodeOutNodes;
  outEdges.forEach((value, key) => {
    if (key.id === startNodeId) {
      startNodeOutNodes = value;
    }
  });
  if (!startNodeOutNodes) {
    startNodeOutNodes = [];
  }
  console.log('startNodeOutNodes: ', startNodeOutNodes);

  
  //信号标记队列，统计每个结点被标记删除的次数，写入signalCountMap
  const toMarkNodeQueue = cloneDeep(startNodeOutNodes);
  while (toMarkNodeQueue.length !== 0) {
    //bfs遍历统计信号数
    const toDeleteNodeId = toMarkNodeQueue.pop().id;
    //console.log('toDeleteNodeId:', toDeleteNodeId);
    //const deleteCount = signalCountMap.get(toDeleteNodeId) || 0;
    let deleteCount;
    signalCountMap.forEach((value, key) => {
      if (key.id === toDeleteNodeId) {
        deleteCount = value;
      }
    });
    if (!deleteCount) {
      deleteCount = 0;
    }
    signalCountMap.set(toDeleteNodeId, deleteCount + 1);
    console.log('signalCountMap:', signalCountMap);
    //const toDeleteNodeTargets = outEdges.get(toDeleteNodeId) || [];
    let toDeleteNodeTargets;
    outEdges.forEach((value, key) => {
      if (key.id === toDeleteNodeId) {
        toDeleteNodeTargets = value;
      }
    });
    if (!toDeleteNodeTargets) {
      toDeleteNodeTargets = [];
    }
    // console.log('toDeleteNodeTargets:', toDeleteNodeTargets);
    toMarkNodeQueue.push(...toDeleteNodeTargets);
  }



  //统计标记删除序号来源队列
  const toDeleteNodeQueueWithEdge = cloneDeep(
    startNodeOutNodes.map((nodeId) => {
      // const edge = edges.find((e) => e["source"] === startNodeId && e["target"] === nodeId.id);
      let _edge;
      edges.forEach((edge) => {
        // console.log('edge.source:', edge);
        if (edge.source.id === startNodeId && edge.target.id === nodeId.id) {
          _edge = edge;
        }
      });
      return { nodeId, _edge };
    })
  );
  console.log('toDeleteNodeQueueWithEdge: ',toDeleteNodeQueueWithEdge.length);

  while (toDeleteNodeQueueWithEdge.length !== 0) {
    //待删除队列中的点边
    const { nodeId, _edge } = toDeleteNodeQueueWithEdge.pop();
    //待删除点的标记删除次数
    const toDeleteNodeIdDeleteCount = signalCountMap.get(nodeId.id) || 0;
    //待删除结点的入度数
    // const toDeleteNodeIdInDegree = (inEdges.get(nodeId) || []).length;
    let toDeleteNodeIdInDegree;
    inEdges.forEach((value, key) => {
      if (key.id === nodeId.id) {
        if (!value) {
          toDeleteNodeIdInDegree = 0;
        } else {
          toDeleteNodeIdInDegree = value.length;
        }
      }
    });
    console.log(nodeId.id, toDeleteNodeIdDeleteCount, toDeleteNodeIdInDegree);
    //待删除结点的子结点
    // const toDeleteNodeTargets = outEdges.get(nodeId) || [];
    let toDeleteNodeTargets;
    outEdges.forEach((value, key) => {
      if (key.id === nodeId.id) {
        toDeleteNodeTargets = value;
      }
    });
    if (!toDeleteNodeTargets) {
      toDeleteNodeTargets = [];
    }
    //要移除的边
    toHideEdges.push(_edge);
    //被删信号数 == 入度数，此结点要删除，他下面的孩子要加入队列进行判断是否要删除
    if (toDeleteNodeIdInDegree - toDeleteNodeIdDeleteCount <= 0) {
      //在图中找寻所有待删除的子结点，加入队列判断是否要删除
      toDeleteNodeTargets.forEach((subNodeId) => {
        //const edge = edges.find((e) => e.source === nodeId && e.target === subNodeId);
        let _newedge;
        edges.forEach((edge) => {
          if (edge.source.id === nodeId.id && edge.target.id === subNodeId.id) {
            _newedge = edge;
            console.log('find the newedge:', _newedge);
          }
        });
        toDeleteNodeQueueWithEdge.push({ nodeId: subNodeId, _edge: _newedge });
      });
      //要移除的点
      toHideNodeIds.push(nodeId);
    }
  }
  console.log('toHideNodeIds:', toHideNodeIds);
  console.log('toHideEdges:', toHideEdges);

  return { toHideNodeIds, toHideEdges };
};