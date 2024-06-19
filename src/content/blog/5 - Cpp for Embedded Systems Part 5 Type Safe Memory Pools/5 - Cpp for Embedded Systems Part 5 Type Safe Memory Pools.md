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

Hi there dear Software/Embedded developers, after 5 years this is the 5th part of a [blog series](/) about using C++ in software development for microcontrollers.

In this article, I will talk about how to avoid void pointer casting when using memory pools and similar RTOS primitives.

## What is a Memory Pool?

Generalizing, when developing firmware for microcontrollers is not possible to allocate dynamic memory, but there is still the need to allocate memory on demand, but how can you allocate memory on demand when all memory needs to be statically allocated at compile time you ask? By using a [Memory Pool](https://en.wikipedia.org/wiki/Memory_pool).

A **Memory Pool** API allows allocating a memory "chunk" divided in equally sized slots.

The following example is a

```c

#define MEM_POOL_CAPACITY (16)
#define QUEUE_CAPACITY (16)

typedef struct {
  int32_t sensor1;
  int16_t sensor2;
  int8_t sensor3;
} Data_t;

MemPoolId_t MemId;
QueueId QueueId;

void ThreadDataAdquisition(){
  while(1){
    // Wait for Sensor Ready Flags
    // ...
    Data_t *data =(Data_t*)MemPoolAlloc(MemId);
    if(data == NULL){
      // handle error
      continue;
    }
    data->sensor1 = Sensor1Read();
    data->sensor2 = Sensor2Read();
    data->sensor3 = Sensor3Read();
    QueueSend(QueueId,(uint32_t)data);
  }
}

void ThreadDataSend(){
  uint8_t buffer[7]={0};
  while(1){
    Data_t *data =(Data_t*)QueueReceived(QueueId);
    if(data == NULL){
      // handle error
      continue;
    }
    SerialSend(data);
    // wait for send to finish
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

  ThreadId_t threadDataId = ThreadNew(ThreadDataAdquisition);
  if(threadDataId  == NULL){
    //bail
  }

  ThreadId_t threadSendId = ThreadNew(ThreadDataAdquisition);
  if(threadSendId   == NULL){
    //bail
  }

  SensorInit();

  KernelStart();
}

```

The code is more or less the same, the Tx/Rx threads and the `hardwareRead` and `hardwareWrite` methods are now a private member of the `SerialPort` class, and because of the threads and asynchronous part of the class is hidden to the user, the use of the class in the `main` function is painless.

## Conclusions

In this post, I explained how and why wrapper a C **RTOS** Thread in a C++ class, and how to use it effectively in an active object. I said it again, and I'll say it again: C++ is your friend and the best part it's that you can use it very gradually. Scary of templates and inheritance? You can just not use them, the use of simple class design with the constructor and destructor is a HUGE advantage when compared to plain C APIs.
