---
title: "Cpp for Embedded Systems Part 1: Heapless Containers"
description: "Series about using C++ in microcontrollers"
pubDate: 2018-03-28
tags: ["cpp", "containers", "collections", "embedded systems", "microcontrollers"]
slug: "Cpp_for_Embedded_Systems_Part_1_Heapless_Containers"
---

To the developers of probably all the programming languages except C++:

_Containers are the Collections of the C++ world._

Let’s clarify the definition of Embedded System that will be used in this post. In the industry Embedded System is a very broad concept that basically includes any programmable device that is used for a very specific task, in contrast with a general purpose PC or Laptop. So, for example:

Is a Raspberry Pi an Embedded System?

For me, the answer depends on the final use of the device. If it’s used to manage a weather station and send the data to a central server, I would call it an Embedded System, but if it has a keyboard, a mouse and a monitor attached and is running a general purpose OS then it's not very different from a general purpose PC.

But an Embedded System could also be running a general purpose OS and be used for only the execution of a very specific task, if this is the case, it’s very likely that the toolchain also supports the C++ Standard Template Library ([STL](https://en.wikipedia.org/wiki/Standard_Template_Library)) that has all types of containers and this post would not make much sense :(.

There is a whole group of Embedded System that can’t run a general purpose OS and/or can’t use dynamic memory (heap) allocation due to the non-deterministic nature of it and the possibility of memory fragmentation.

The reasons for not be able to use a general purpose OS could be that it can’t meet the Real Time requirements of the application, or that the underlying hardware doesn’t support it, because of the lack of an [MMU](https://en.wikipedia.org/wiki/Memory_management_unit).

Summarizing, this post is about C++ container for systems that for some reason can’t use dynamic memory allocation and for extension the C++ STL, or shorter: this post is about “C++ Containers for microcontrollers”.

## Static or stack-based memory allocation

Having all your memory allocation static or stack-based has the advantage that because of all allocation happens at compile time, first it’s deterministic and second, the compiler reports the exact memory footprint of your application, and then the linker knows if the application fits in the device memory or not, and all this just by building the application. The are several ways of using this type of memory allocation for all your container-like needs:

## C arrays

In the land of the microcontroller programming, this is the most used “pattern” for container-like data structures, and for “pattern” I meant plain C arrays:

```c
#define BUFFER_SIZE = 128;
char buffer[BUFFER_SIZE] = {0};

void UseBuffer(char *buffer, int bufferSize);

int main(){
    UseBuffer(buffer, BUFFER_SIZE);
    //...
}
```

This approach has a lot of shortcomings:

- The arrays are not aware of its size.
- Don’t support generic programming, so for every different type of array its necessary a complete copy/paste of most of the code, or use _void pointer magic._
- To archive static/stack-based allocation it's probably necessary to keep a global `#define` with the array size, for every different array size.
- **#crazy #madness**, etc

This example could be easily improved with the use of C structs and C functions to encapsulate most of the functionality but will continue to lack genericity and it will still be necessary to use macros to define different array sizes.

There are esoteric solutions using very elaborate C macros and the preprocessor concatenation operator `##`. But if your underlying architecture has a decent C++ compiler support, I really don’t see the point to stick with plain C.

## C++ generic array with stack-based allocation

The STL has an implementation for this type of container, but this class, in particular, needs C++11 support, which is a problem in the microcontroller land, because not all architectures have C++11 support … yet, and probably you will be using a third-party library that fails to compile or link, and because of all this, it’s probably safe to stay with C++03. Besides in the introduction was established that STL was banished from a practical use in the microcontroller land.

Nevertheless, this type of containers has another a very interesting shortcoming. Take a look at this code:

```cpp
#include <cstdint>
#include <array> //need C++ 11 support

using namespace std;

void UseBuffer(array<uint8_t, 32> &bufferRef);

int main{
    // From the compiler point of view those are actually two different classes:
    array<uint8_t, 32> array32;
    array<uint8_t, 64> array64;
    UseBuffer(array32);
    UseBuffer(array64); //compile error
}
```

The example above shows how this type of class declaration has a serious shortcoming when you want to build abstractions over it. For the compiler, these two declarations are completely different classes:

```cpp
array<uint8_t, 32> array32;
array<uint8_t, 64> array64;
```

Because of that, you can’t have a common reference for two arrays of different size and all the abstractions that you build can only work for arrays of the same size, which presents scalability problems and would limit its application in real-world solutions.

## Improved C++ generic array with stack-based allocation

So what to do? With a little of C++ template magic and inheritance is possible to archive the three main characteristics of a C++ container in microcontroller land:

- Stack-based Memory Allocation
- Genericity
- Build abstractions on top of the containers

Take a look at this:

```cpp
template <typename Type>
class Array
{
public:
    std::size_t size() const
    {
        return _arraySize;
    }

    bool isFull() const{
        return (_writeCount == _arraySize);
    }

    bool append(const Type &data){
        if (isFull())
        {
            return false;
        }
        _arrayPtr[_writeCount] = data;
        _writeCount++;
        return true;
    }

protected:
    Array(Type *arrayPtr, std::size_t arraySize):
        _arrayPtr(arrayPtr),
        _arraySize(arraySize),
        _writeCount(0)
    {
    }
    Type *_arrayPtr;
    std::size_t _arraySize;
    std::size_t _writeCount;
};

namespace Declare
{
template <typename Type, std::size_t size = 128>
class Array: public ::Array<Type>
{
public:
    Array():
    ::Array<Type>(\_array, size)
    {
    }
private:
    Type _array[size];
};
}
```

This code fragment it’s a simplification of an [Array Class](https://gitlab.com/ecruzolivera/eHSM/blob/master/Include/Array.hpp) that is part of a Hierarchical State Machine library that I co-developed some time ago.

The idea is to split the container into two classes, the Array class, and the Declare::Array class. The first one has all the functionality and the later one derives from the first one and do the actual memory allocation.

So you can use it like this:

```cpp
#include <cstdint>
#include "Array.hpp"
using namespace std;

void FillArray(Array<uint8_t> &arrayRef, uint8_t value);

int main()
{
    // They Are actually different type of classes, Array<uint8_t, 16> and Array<uint8_t, 32>
    Declare::Array<uint8_t, 16> uint8x16Array;
    Declare::Array<uint8_t, 32> uint8x32Array;
    // Nevertheless You can use the same pointer/reference (Array<uint8_t>*) to both classes
    FillArray(uint8x16Array, 5);
    FillArray(uint8x32Array, 9);
}
```

This pattern, for which I don’t really have a name, so lets informally call it **“The Declare:: Pattern”**..... mehh...., has allowed me to write C++ microcontroller applications that can really leverage the power of C++ as a language for this type of devices. C++ allows the development of generic and type-safe containers that are much safer and fun to use than the plain C equivalent.

For the developers of microcontrollers applications that think that C++ is overkill or bloat or whatever another probably not true statement: It’s not the 90’s anymore, all major architectures have very good C++ support, take time to learn the language and forget the libraries, which you probably will not be able to use anyway. Templates could be your best friend that saves you a LOT of typing and debugging time.

## Conclusions

In this post, I explain how stack-based memory allocation is a win-win for microcontrollers applications, and how the use of C++ metaprogramming (templates) and inheritance allows the development of data structures that are allocated on the stack, but can be referenced like if they were on the heap.
