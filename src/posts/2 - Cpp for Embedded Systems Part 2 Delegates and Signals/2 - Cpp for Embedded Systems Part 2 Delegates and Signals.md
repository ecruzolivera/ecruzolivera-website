---
title : "Cpp for Embedded Systems Part 2: Delegates and Signals"
description : "Series about using C++ in microcontrollers"
date : 2018-11-22
slug : "Cpp for Embedded Systems Part 2: Delegates and Signals" 
tags : ["cpp", "containers", "collections", "embedded systems", "microcontrollers"]
---

# Cpp for Embedded Systems Part 2: Delegates and Signals

Here I am in the mission of provoking an aneurysm to the "hardcore" C/ASM microcontrollers developers. On this front, several months ago, I posted the first article in the series where is explained a technique using C++ template magic with a little of inheritance, to archive true type-safe and bound-checked containers at compile time without using dynamic memory allocation.

In this article, I will explain how to leverage those containers to use a Delegate and a Signal class that can be used with the following requirements:

- no heap
- no exceptions
- no external libraries
- C++x03

All those requirements are needed to be able to squeeze the code in a microcontroller.

At this point perhaps you are asking: "But why?, why in the name of all that is good I will use such thing in an embedded device?

For a 1KB RAM microcontroller that only needs to watch a voltage level and toggle a PIN for whatever reason, I would say that you will only need a C compiler for your architecture, but since the arrival of the ARM Cortex-M architecture we have been seeing the rise of behemoths like the STM32H7 microcontroller family with more peripherals that you will need, and more memory that you will be able to use in plain C without blow something.

With those microcontrollers, you will be able to handle several tasks at the same time using a Real-Time OS and to properly grow your application without fall into spaghetti code and madness, you will need high-level abstractions to keep the code modular and with a minimal surface area between the modules, and to really leverage all the power and versatility of the new generation of microcontrollers.

It's almost impossible that you application scale if your foundations are macros and plain C function callbacks, of course, that are examples of excellent C code base like the Linux kernel but let's face it, the average developer is not as skilled and disciplined as a Linux Kernel developer.

Now you could say, "but in C you could also implement high-level abstractions, look at the GTK libraries!!!"

Ok, the [GTK project](https://en.wikipedia.org/wiki/GTK%2B) is an excellent collection of libraries to develop GUI applications in C and almost no one use it in plain C. Most developers use other languages bindings to interact with GTK like PyGTK or Vala because of all the ceremony/pain of using GTK in plain C entails .... use [Qt](<https://en.wikipedia.org/wiki/Qt_(software)>),....cough, cough ......use Qt.

## Delegate

The code below shows an example of the Delegate class binding every type of ..."thing".... that can be bounded in C++.

```cpp
#include <stdio.h>
#include <cstdint>
#include "../../Include/Delegate.hpp"

using namespace std;

class MyClass
{
public:
    MyClass()
    {
    }
    void method(){
    printf("MyClass Method called\r\n");
    }
    static void staticMethod(){
    printf("MyClass Static method called\r\n");
    }
    void methodWithParameter(int param){
    printf("MyClass Parameter %i called\r\n", param);
    }
};

int main()
{
    MyClass myclass;

    eHSM::Delegate<void> delegate;

    delegate.bind<MyClass, &MyClass::method>(&myclass);
    delegate();

    delegate.bind<MyClass::staticMethod>();
    delegate();

    eHSM::Delegate<int> delegateInt;
    delegateInt.bind<MyClass, &MyClass::methodWithParameter>(&myclass);

    delegateInt(5);
}
```

```console
output:
MyClass Method called
MyClass Static method called
MyClass Parameter 5 called
The class is able to bind:

a global function
a static class method
a class method
```

Limited to just one method at the time, and zero (void) or one parameter (passed by value). The class has the function call operator () overloaded to call the bound method (if any). It's designed to be the least intrusive possible and if is called without a method bound it just do nothing. If it has a method bound and you want to bind another one, it let you do it. Also has utility functions like isBinded(), isUnbinded() and clear() and they do what you think they should do.

## Signal

The Signal class that borrows a lot from Qt signal and slots concept, I'm a huge fan of Qt, for me, it's the only way of programming in C++ without start crying.

This class holds an internal array of Delegates which size must be specified at compile time.

```cpp
#include <stdio.h>
#include <cstdint>
#include "../../Include/Signal.hpp"

using namespace std;

class MyClass
{
public:
    MyClass()
    {
    }

    void method(){
        printf("MyClass Method called\r\n");
    }

    static void staticMethod(){
        printf("MyClass Static method called\r\n");
    }

    void methodWithParameter(int param){
        printf("MyClass Parameter %i called\r\n", param);
    }
};

class MyClass2
{
public:
    MyClass2()
    {
    }

    void method(){
        printf("MyClass2 Method called\r\n");
    }

    static void staticMethod(){
        printf("MyClass2 Static method called\r\n");
    }

    void methodWithParameter(int param){
        printf("MyClass2 Parameter %i called\r\n", param);
    }
};

int main()
{
    MyClass myclass;
    MyClass2 myclass2;
    const int SIGNAL_SLOTS = 4;
    const int SIGNAL_SLOTS_2 = 2;

    eHSM::Signal<void, SIGNAL_SLOTS> signalVoid;
    signalVoid.connect<MyClass, &MyClass::method>(&myclass);
    signalVoid.connect<MyClass::staticMethod>();

    signalVoid.connect<MyClass2, &MyClass2::method>(&myclass2);
    signalVoid.connect<MyClass2::staticMethod>();
    signalVoid.notify();

    eHSM::Signal<int, SIGNAL_SLOTS_2> signalInt;
    signalInt.connect<MyClass, &MyClass::methodWithParameter>(&myclass);
    signalInt.connect<MyClass2, &MyClass2::methodWithParameter>(&myclass2);
    signalInt.notify(5);
}
```

```console
output:
MyClass Method called
MyClass Static method called
MyClass2 Method called
MyClass2 Static method called
MyClass Parameter 5 called
MyClass2 Parameter 5 called
```

In the example, two signals are instantiated one that can be connected up to four functions and another which has an int parameter and can be connected up to two functions.

The connected methods/functions are called in the same order that they are connected. The connections can be overwritten, they must be disconnected explicitly.

Remember that these classes are meant to use in an environment where no objects are ever destroyed, so it's up to you to be sure that the instance to which de signal is connected it's alive when the method notify() its called. If the connected instance is destroyed while and the signal its triggered then ... Kaput!!

## Conclusion

A Delegate and Signal Pattern implementation will ease the development of microcontrollers applications that need to handle several tasks and, perhaps more important, that need to be maintained for several years.

These two classes are part of a hierarchical state machine library that can be found here.

The next article in this series will be about what is a hierarchical state machine library and how and what type of problems it solves.
