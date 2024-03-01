---
title : "Cpp for Embedded Systems Part 4: Better Threads"
description : "Series about using C++ in microcontrollers"
date :  2019-04-21
slug : "Cpp_for_Embedded_Systems_Part_4_Better_Threads" 
tags : ["cpp", "containers", "collections", "embedded systems", "microcontrollers", "state machines"]
---

Hi there dear Software/Embedded developers, this is the 4th part of a [blog series](https://ecruzolivera.tech/blog/) about using C++ in software development for microcontrollers.

In this article, I will talk about why I love RTOS (Real Time Operative Systems), but why I dislike most of the API that most RTOS vendors offer, and what can we do about it. 

As a sort of footnote, the code is this post is in no way production anything, in pasts posts I have used code snippets from classes and libraries that are tested and that check for runtime errors in every method call. In this post, for the sake of brevity, I minimize the run-time error checking in order to keep the code flow clear and more understandable.

## What is a RTOS?

An RTOS is an operating system specifically tailored to real-time applications, and what is a real-time application you may ask?

> A real-time application is an application in which all latencies are deterministic.

Now we have another two keywords _latencies_ and _deterministic_.

- **Latency**: [Latency](<https://en.wikipedia.org/wiki/Latency_(engineering)#Computer_hardware_and_operating_system_latency>) is a time interval between an stimulus and the response.
- **Deterministic**: Every latency must have a knowable upper bound value.

For example in a desktop general purpose OS, the latency of a letter showing in the screen when you press a key can't be know in a deterministic way, because of the value will always be changing with the current system load; therefore a desktop OS can't be used in a real-time application. In Embedded Systems "Real-Time" has nothing to do with clock speed or memory size, you can have a real-time application in a 1 MHz system and in a 1 GHz one. The only requirement is that the latency of the response to an input must be deterministic.

The biggest advantage of using an RTOS is that it allows an abstraction of the logical tasks in an embedded application. The different tasks(Data Acquisition,  Data Processing, Data Transmission, Control Loops, etc) can be decoupled using the thread-safe RTOS primitives (Thread flags, Semaphores, Mailboxes, etc). Using this approach several developers can work in the same project without stopping on each other's feet.

For more details about RTOS and Real-Time systems you can read these articles:

1. [What is An RTOS? (from FreeRTOS)](https://www.freertos.org/about-RTOS.html)
2. [Real-time operating system (from Wikipedia)](https://en.wikipedia.org/wiki/Real-time_operating_system)
3. [What is an RTOS?  (from High Integrity Systems)](https://www.highintegritysystems.com/rtos/what-is-an-rtos/)
4. [What is an RTOS?  (from Micrium)](https://www.micrium.com/rtos/what-is-an-rtos/)
5. [What is a Real-Time Operating System (RTOS)?  (from National Instruments)](http://www.ni.com/en-us/innovations/white-papers/07/what-is-a-real-time-operating-system--rtos--.html)

## Current threads APIs

Most current RTOS APIs are C based ones, there are several reasons why this is so:

- **Portability**: C is still more supported than C++.
- **Longevity**: Most current used RTOS (FreeRTOS, VxWorks, QNX, etc) are 10+ years old and when they started to be developed, C was the only real option for embedded software development (except for [Ada](https://en.wikipedia.org/wiki/Ada_(programming_language)), but [Ada](https://en.wikipedia.org/wiki/Ada_(programming_language)) hasn't really taken off in most embedded applications).
- **The "Simple Language" vs "Bloated Language" argument**: Most of the embedded developers that I have meet react to C++ like the vampires to garlic, no matter that every mayor architecture supports C++ by now, but they tend to be conservative in technology adoption and throw the argument C is simple and easy to get (which is true) and C++ it's bloated and unnecessary.

Most RTOS thread APIs uses a plain C function with several parameters including a pointer to the thread function and the argument to be passed to the thread, and in some way returns the thread handle. For example, the code below is a hypothetical RTOS that initializes two threads A and B:

```cpp
void Thread_A(void *arg){
    int argument = *(int *)arg;
    while(1){
        // Do something
    }
}

void Thread_B(void *arg){
    while(1){
        // Do something
    }
}

// ...

void main(){
    int argument = 1;
    ThreadHandle_t thread_A = ThreadCreate(Thread_A, (void *)&argument);
    ThreadHandle_t thread_B = ThreadCreate(Thread_B, NULL);

    //...
}
```

The APIs functions signatures change between one RTOS and another but in the end, all are used more or less in the same way. The problem with this approach it's that is very difficult to encapsulate different threads in separated files and keep a global state and access without completely break encapsulation.

This type of APIs tends to produce a single _main.c_ file with several hundreds of lines of code, that is a nightmare to debug and maintain. I know that you can organize your code around and of course, that compilation unit level scoping of variables can keep the global state under control, but sadly a lot of firmware are a **single** huge _main.c_ file that no one has any idea how to track the program flow.

There are RTOS with available C++ APIs like for example the [Mbed RTOS wrapper](https://os.mbed.com/docs/mbed-os/v5.12/apis/rtos.html) to the [ARM-RTX RTOS](http://www.keil.com/arm/rl-arm/kernel.asp), but the question that I will answer is:

> How to develop a C++ microcontroller application when what I have is a plain C RTOS API?

## Better Threads

I will not ask you to develop an RTOS in C++, I will just show to you how to make a thin wrapper around your current API in order to use it in a more ergonomic and type-safe way. So, What are the necessary interface of a "decent" Thread class? The ultimate goal will be to be able to use any C++ class method as the thread function, but first, let's start with only provide an abstract class with a pure virtual `run` method that needs to be reimplemented in a subclass.

Because of the C API only accepts C functions and static C++ methods. The wrapper class must register a private static method as the Thread function in the RTOS API. This static method must receive a Thread Class instance as the parameter in order to be able to reuse the class in several thread instances, let's take a look to the code in order to start to understand this little mess :-)

```cpp
class Thread {
public:
    Thread():threadHandler_(NULL){}
    
    virtual ~Thread(){
        terminate();
    }
    
    bool start(){
        if(threadHandler_ != NULL){
            threadHandler_ = ThreadCreate(reinterpret_cast<void (*)(void *)>(EntryPoint),
                                          reinterpret_cast<void *>(this));
            return true;        
        }
        return false;
    }

    void terminate(){
        if(threadHandler_ != NULL){
            ThreadDestroy(threadHandler);
            threadHandler == NULL;
        } 
    }

protected:
    virtual void run() = 0;

private:
    static void eThread::EntryPoint(eThread *threadInstance){
       threadInstance->run();
       // if for some reason the developer forgets to put an infinite loop inside the run method
       threadInstance->terminate();
    }

    ThreadHandler_t handler_;
};


class ThreadA: public Thread{
protected:
    virtual void run(){
        while(true){
            // Do something
        }
    }
};

class ThreadB: public Thread{
protected:
    virtual void run(){
        while(true){
            // Do something
        }
    }
};


void main(){
    ThreadA threadA;
    ThreadB threadB;
    if(!threadA.start() || !threadB.start()){
        //error
    }
    // ...

}
```

The Thread wrapper class has the static private method `EntryPoint` that is passed as the RTOS thread function, this method receives as a parameter the thread C++ instance in order to be able to run the instance `run` method. 

You may ask: But what about parameterized threads? 

Now that the thread parameter is used as the internal workaround to the C thread function of the RTOS API, How can we use a parameterized thread with the C++ wrapper?

First, let's analyze a plain C RTOS code that reuses a thread function to blink a led, and the led is passed as a parameter:

```cpp
void ThreadLedBlink(void *arg){
    int ledId = *(int*)arg;
    while(1){
        LedOn(ledId);
        ThreadSleep(500);
        LedOff(ledId);
        ThreadSleep(500);
    }
}

void main(){
    const int led1Id = 1;
    const int led2Id = 2;
    ThreadHandle_t threadBlinkLed1 = ThreadCreate(ThreadLedBlink, (void *)&led1Id);
    ThreadHandle_t threadBlinkLed2 = ThreadCreate(ThreadLedBlink, (void *)&led2Id);

    //...
}
```

The same solution using the C+++ wrapper Thread class:

```cpp
class ThreadLedBlink: public Thread{
public:
    ThreadLedBlink(int ledId):ledId_(ledId){}

protected:
    virtual void run(){
        while(true){
            LedOn(ledId_);
            ThreadSleep(500);
            LedOff(ledId_);
            ThreadSleep(500);
        }
    }
private:
    const int ledId_;
};


void main(){
    ThreadLedBlink threadBlinkLed1(1);
    ThreadLedBlink threadBlinkLed2(2);
    if(!threadBlinkLed1.start() || !threadBlinkLed2.start()){
        //error
    }
    //...
}
```

Because of the Thread subclass is a C++ class we can do whatever we want with it, in the example I chose to pass the parameter in the class constructor, but in reality, you can do whatever you want. The C++ subclassing is arguably more reusable than the plain C version, and it gets rid of the constant typecasting which improves the type safety of the final application.


## Even Better Threads

It will be desirable to be able to create a thread without the constant subclassing of the Thread wrapper class, in order to do that the wrapper must be able to use any nonmember C/C++ method as the thread function. For this I use a [delegate class](https://gitlab.com/ecruzolivera/eHSM/blob/master/Include/Delegate.hpp), that is part of a library for a [Hierarchical State Machine](https://gitlab.com/ecruzolivera/eHSM) that I have been discussing in the past [articles](https://ecruzolivera.tech/posts/).

```cpp
class Thread {
public:
    Thread():threadHandler_(NULL){}
    
    virtual ~Thread(){
        terminate();
    }
    
    bool start(){
        if(threadHandler_ != NULL){
            threadHandler_ = ThreadCreate(reinterpret_cast<void (*)(void *)>(EntryPoint), reinterpret_cast<void *>(this));
            return true;        
        }
        return false;
    }

    void terminate(){
        if(threadHandler_ != NULL){
            ThreadDestroy(threadHandler);
            threadHandler == NULL;
        } 
    }

    template <void (*Method)(void)>
    bool attachRunMethod() {
        if (delegate_.isUnBound()) {
            delegate_.bind<Method>();
            return true;
        }
        return false;
    }

    template <class T, void (T::*Method)(void)>
    bool attachRunMethod(T *obj) {
        if (delegate_.isUnBound()) {
            delegate_.bind<T, Method>(obj);
            return true;
        }
        return false;
    }

protected:
    virtual void run(){}

private:
    static void eThread::EntryPoint(eThread *threadInstance){
        if(threadInstance->delegate_.isBound()){
            threadInstance->delegate_();
        }else{
            threadInstance->run();
        }
        // if for some reason the developer forgets to put an infinite loop inside the run method
        threadInstance->terminate();
    }

    ThreadHandler_t handler_;
    Delegate<void> delegate_;
};


```

The new thread class has a new private member `Delegate<void> delegate_` through which is possible to bind any C/C++ method, and the `Thread::run` method gets an empty implementation in order to be able to instantiate a thread without subclassing it. The code below is an example of a SerialPort class that is used in conjunction with two threads for reading and writing asynchronous into the [UART](https://en.wikipedia.org/wiki/Universal_asynchronous_receiver-transmitter) hardware. 

The `SerialPort` class uses a hypothetical underlying C API to talk to the hardware and also uses another hypothetical `ThreadSafeRingBuffer` class that is basically a standard [FIFO](https://en.wikipedia.org/wiki/FIFO_(computing_and_electronics)) data structure that is thread-safe, all RTOS have some variation of that. 

The `SerialPort` class isn't in any way the best design for a proper serial port class, the "real one" will probably use [DMA](https://en.wikipedia.org/wiki/Direct_memory_access) for the transmission and reception of data, but this blog post is already long, and I'm trying to keep it simple.

```cpp
class SerialPort{
public:
    SerialPort(int portId, int bufferSize = 128):
    uart_(NULL)
    ,rx_(bufferSize)
    ,tx_(bufferSize)
    {
        uart_ = UartInit(portId);
    }
    
    ~SerialPort(){
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

private:
    UartHandler_t uart_;
    ThreadSafeRingBuffer rx_;
    ThreadSafeRingBuffer tx_;
};


void main(){
    SerialPort serial(0);
    Thread threadRx
    threadRx.attachRunMethod<SerialPort, &SerialPort::hardwareRead>(&serial);
    Thread threadTx;
    threadTx.attachRunMethod<SerialPort, &SerialPort::hardwareWrite>(&serial);
    if(!threadRx.start() || !threadTx.start()){
        //error
    }
    const int bufferSize = 64;
    std::uint8_t buffer[bufferSize];
    int bytesReaded = serial.read(buffer, bufferSize);
    // ...
}
```

The main caveat of this example is the need to instantiate the threads and the serial port manually in the main function and make them work together. 

In the next section we will learn why:

> The best Thread is the one that you don't see.

## Even Better Threads: Active Objects

The objective of the [Active Object Pattern](https://en.wikipedia.org/wiki/Active_object) is to decouple the method invocation from the execution. In other words: hide the thread to the class/library user. Let's reimplement the serial port class but as an active object:

For a more complete explanation of the active object pattern please read the [Dr. Dobb's article](http://www.drdobbs.com/parallel/prefer-using-active-objects-instead-of-n/225700095?pgno=1) about the subject.


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

In this post, I explain how and why wrapper a C RTOS Thread in a C++ class, and how to use it effectively in an active object. I said it again and I'll say it again: C++ is your friend and the best part it's that you can use it very gradually. Scary of templates and inheritance? you can just not use them, the use of simple class design with the constructor and destructor is a HUGE advantage when compared to plain C APIs.
