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

Generalizing, when developing firmware for microcontrollers is not possible to allocate dynamic memory, but there is still the need to allocate m , In the context of **RTOS**, a Memory Pool is a primitive to create pools of memory ...

```cpp
class SerialPort{
public:
    SerialPort(int portId, int bufferSize = 128):
    uart_(NULL)
    ,rx_(bufferSize)
    ,tx_(bufferSize)
    {
        uart_ = UartInit(portId);
        threadRx_.attachRunMethod<SerialPort, &SerialPort::hardwareRead>(&this);
        threadTx_.attachRunMethod<SerialPort, &SerialPort::hardwareWrite>(&this);
        threadRx_.start();
        threadTx_.start();
    }

    ~SerialPort(){
        threadRx_.terminate();
        threadTx_.terminate();
        UartDeInit(uart_);
    }


    int read(std::uint8_t *dataPtr, int size){
        int bytesReaded = rx_.read(dataPtr, size);
        return bytesReaded;
    }

    int write(const std::uint8_t *dataPtr, int size){
        int bytesWritten = tx_.write(dataPtr, size);
        return bytesWritten;
    }

private:
    void hardwareRead(){
        while(true){
            UartBlockUntilByteAvailable(uart_); // magic function that blocks the thread until a byte is available.
            std::uint8_t byte = UartReadByte(uart_);
            rx_.write(byte);
        }
    }

    void hardwareWrite(){
        while(true){
            std::uint8_t byte = tx_.read();
            UartWriteByte(uart_, byte);
            UartBlockUntilByteWritten(uart_); // magic function that blocks the thread until a byte is written.
        }
    }

    UartHandler_t uart_;
    ThreadSafeRingBuffer rx_;
    ThreadSafeRingBuffer tx_;
    Thread threadRx_;
    Thread threadTx_;

};


void main(){
    SerialPort serial(0);
    const int bufferSize = 64;
    std::uint8_t buffer[bufferSize];
    int bytesReaded = serial.read(buffer, bufferSize);
    // ...
}
```

The code is more or less the same, the Tx/Rx threads and the `hardwareRead` and `hardwareWrite` methods are now a private member of the `SerialPort` class, and because of the threads and asynchronous part of the class is hidden to the user, the use of the class in the `main` function is painless.

## Conclusions

In this post, I explained how and why wrapper a C **RTOS** Thread in a C++ class, and how to use it effectively in an active object. I said it again, and I'll say it again: C++ is your friend and the best part it's that you can use it very gradually. Scary of templates and inheritance? You can just not use them, the use of simple class design with the constructor and destructor is a HUGE advantage when compared to plain C APIs.
