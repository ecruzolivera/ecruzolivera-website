---
title: "Cpp for Embedded Systems Part 5: Type Safe Memory Pools"
description: "Series about using C++ in microcontrollers"
pubDate: 2024-06-14
slug: "Cpp_for_Embedded_Systems_Part_5_Type_Safe_Memory_Pools"
tags: ["cpp", "containers", "collections", "embedded systems", "microcontrollers", "RTOS", "Memory"]
---

<!--toc:start-->

- [What is a RTOS?](#what-is-a-rtos)
<!--toc:end-->

Hi there, after 5 years this is the 5th part of a [blog series](/) about using C++ in software development for microcontrollers.

In this article, I will talk about how to avoid void pointer casting when using memory pools and similar RTOS primitives.

## What is a Memory Pool?

Generalizing, when developing firmware for microcontrollers is not possible to allocate dynamic memory, but there is still the need to allocate memory on demand, but how can you allocate memory on demand when all memory needs to be statically allocated at compile time you ask? By using a [Memory Pool](https://en.wikipedia.org/wiki/Memory_pool).

A **Memory Pool** allows allocating a memory slot from a pool of equally divided slots.

The following example is a typical usage of a memory pool.

```c

#define MEM_POOL_CAPACITY (16)
#define QUEUE_CAPACITY (16)
#define BUFFER_SIZE (128)

typedef enum {
  Sensor1,
  Sensor2,
} Sensor_t;

typedef struct {
  int32_t data[BUFFER_SIZE]
  Sensor_t sensorType;
} Data_t;

MemPoolId_t MemId;
QueueId_t QueueId;

void ThreadSensor1(){
  while(1) {
    Data_t *data =(Data_t*)MemPoolAlloc(MemId);
    Sensor1DMARead(data->data, BUFFER_SIZE);
    // Wait DMA to finish
    // ...
    data->sensorType = Sensor1;
    QueueSend(QueueId,(uint32_t)data);
  }
}

void ThreadSensor2(){
  while(1){
    Data_t *data =(Data_t*)MemPoolAlloc(MemId);
    Sensor2DMARead(data->data, BUFFER_SIZE);
    // Wait DMA to finish
    // ...
    data->sensorType = Sensor2;
    QueueSend(QueueId,(uint32_t)data);
  }
}

void ThreadDataSend(){
  while(1){
    Data_t *data =(Data_t*)QueueReceived(QueueId);
    SerialSend(data);
    // wait for send to finish
    //...
    MemPoolFree(MemId, data);
  }
}

void main(){
  KernelInit();

  MemId = MemPoolNew(sizeof(Data_t), MEM_POOL_CAPACITY);
  if(MemId == NULL){
    //bail
  }

  QueueId = QueueNew(QUEUE_CAPACITY);
  if(QueueId == NULL){
    //bail
  }

  ThreadId_t threadSensor1Id = ThreadNew(ThreadSensor1);
  if(threadDataId  == NULL){
    //bail
  }

  ThreadId_t threadSensor2Id = ThreadNew(ThreadSensor2);
  if(threadSensor2Id == NULL){
    //bail
  }

  ThreadId_t threadDataSendId = ThreadNew(ThreadDataSend);
  if(threadSensor2Id == NULL){
    //bail
  }

  SensorInit();

  KernelStart();
}

```

There are two data acquisition threads, `ThreadSensor1` and `ThreadSensor2`, those threads abstract the process of reading from a sensor, then allocate a memory slot from the pool, and then send the data pointer via an RTOS queue. The last Thread is the `ThreadDataSend`, it reads from the queue and serializes and send the data.

Don't overanalyze the logic behind those threads, for the context of this post the important part is how the Memory Pool is usually used to allocated memory. The main downside is that a cast is needed to retrieve the type behind the pointer, because C based memory pool only handles void pointers.

It is not hard to imagine that in a project with several memory pools that allocates different data types, a few threads juggling void pointers between them, and having to constantly cast the pointer type. Constantly casting pointers in the program logic is a recipe for increased debugging time while tracking pointer issues.

## Conclusions

In this post, I explained how and why wrapper a C **RTOS** Thread in a C++ class, and how to use it effectively in an active object. I said it again, and I'll say it again: C++ is your friend and the best part it's that you can use it very gradually. Scary of templates and inheritance? You can just not use them, the use of simple class design with the constructor and destructor is a HUGE advantage when compared to plain C APIs.
