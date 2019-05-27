---
title : "Cpp for Embedded Systems Part 3: Hierarchical State Machines"
description : "Series about using C++ in microcontrollers"
date :  2019-03-20
slug : "Cpp for Embedded Systems Part 3: Hierarchical State Machines" 
tags : ["cpp", "containers", "collections", "embedded systems", "microcontrollers", "state machines"]
---

# Cpp for Embedded Systems Part 3: Hierarchical State Machines

Hi there dear Software/Embedded developers, this is the 3rd part of a [post series](https://ecruzolivera.tech/posts/) about using C++ in software development for microcontrollers. In the [first](https://ecruzolivera.tech/posts/cpp-for-embedded-systems-part-1-heapless-containers/) article I explained a technique that uses C++ templates and inheritance for the developing data structures that are allocated on the stack but can be referenced like if they were on the heap. In the [second](https://ecruzolivera.tech/posts/cpp-for-embedded-systems-part-2-delegates-and-signals/) article in the series, I used those data structures to create a Signal and Delegate class that allows the use of one or multiple callbacks in a type-safe way.

In this article, I will develop a Hierarchical State Machine [library](https://gitlab.com/ecruzolivera/eHSM) with the following requirements:

- no heap
- no exceptions
- no external libraries
- C++x03

The need for those requirements has been extensible explained in the previous articles.

As a sort of a foot note (in the introduction ;-)), I'm an advocate for C++ in bare-metal applications but in all the examples i use `prinft` instead of `std::cout`, and you may ask: Why not C++ all the way down? Most architectures have a decent printf implementation some with limitations like, for example, you cant print floats, meanwhile `std::cout` _will eat your memory_. So i use `printf` in order to be able to copy paste the code into a microcontroller without any stack overflow apocalypse.

In full disclosure, this library was developed with the help of [Manuel Alejandro Linares Paez](https://www.linkedin.com/in/manuel-alejandro-linares-paez/).

## What is a Hierarchical State Machine?

Lets first talk about "simple" State Machines most formally know as Finite State Machines because of the ... finite states. These are the classical Computer Science and Electrical Engineering State Machines usually thought in Digital Electronics classes.
This type of States Machines are often used to model several systems with clear states and outputs for every state. They are used from a simple turnstile control to a compiler lexical parser, and they help a LOT to keep the solution simple and auditable.

The Hierarchical part is a sort of extension to the concept in which the states can be nested in order to add encapsulation to them, it also introduces the concepts of onEnter/onExit that are actions that can be triggered when a state is entered or exited, and when used in conjunction with the nested states this type of actions are chained and several onEnter/onExit can be executed when the states are transverse from a parent to a child state, and vice versa.

For a comprehensive Hierarchical State Machine articles please read the [Introduction to Hierarchical State Machines](https://barrgroup.com/Embedded-Systems/How-To/Introduction-Hierarchical-State-Machines) from the [Barr Group](https://barrgroup.com/), and for an entire framework solution read Miro Samek book [Practical UML StateCharts in C/C++](http://www.state-machine.com/psicc2/).

In the Computer Science and Software Engineering world, there is a similar concept to the State Machine know as the [State Pattern](https://en.wikipedia.org/wiki/State_pattern). The differences are subtle and the final implementation blurs the lines between the concepts so you could use it how it fits more to your needs.

## Ad-Hoc state machine implementation

Most of us have used what I like to call _ad-hoc-on-the-fly-switch-case-state-machines_, What I mean by this?
Let use an example with a simple [turnstile machine](https://en.wikipedia.org/wiki/Turnstile).

![Turnstile state chart Image](/images/Turnstile_StateChart.svg.png)

The turnstile state chart is like the "hello world" of the state machine designs, it's simple and has all the features of a finite state machine: events, transitions, auto-transitions, and states. In the example the are two possible states **Lock** (initial state) and **UnLock**, and two possible events or inputs: **Coin** inserted and **Push** bar.

The system will be initially locked until the **Coin** event is dispatched, then it will be in this state until the user turns the turnstile bar which will dispatch the **Push** event and the state machine will transitioning to the **Lock** state.

Lets code de machine using the `switch case` statement:

```cpp
#include <stdio.h>

using namespace std;

enum Event { Coin, Push };

enum States { Lock, UnLock };

void Dispatch(Event event) {
  static int state = Lock;
  switch (state) {
  case Lock:
    if (event == Coin) {
      state = UnLock;
      printf("Transition Lock -> UnLock \n\r");
    } else if (event == Push) {
      printf("Autotransition Lock -> Lock \n\r");
    } else {
      printf("Event Error: %i is not a valid event!! \n\r", event);
    }
    break;
  case UnLock:
    if (event == Coin) {
      printf("Autotransition UnLock -> UnLock \n\r");
    } else if (event == Push) {
      state = Lock;
      printf("Transition UnLock -> Lock \n\r");
    } else {
      printf("Event Error: %i is not a valid event!! \n\r", event);
    }
    break;
  default:
    printf("Error: %i is not a valid state!! \n\r");
  }
}

int main() {
  Dispatch(Push);
  Dispatch(Coin);
  Dispatch(Coin);
  Dispatch(Push);

}
```

This is the console output:

```console
Autotransition Lock -> Lock
Transition Lock -> UnLock
Autotransition UnLock -> UnLock
Transition UnLock -> Lock
```

The `switch case` pattern is a first approximation that sort of works for a very small state machine (note the lack of hierarchical in the machine), but the level of spaghetti code grow exponentially every time that you add a new state, event or transition. For the perhaps not well versed in the C/C++ inner workings, the declaration `static int state = Lock;` is interesting because of the `static` modifier in a local variable declaration, when a local variable is declared as `static` it behaves as a global declaration but with a local scope.

What did I mean by that? Well, in this case, the `state` variable is allocated in the [data segment](https://www.geeksforgeeks.org/memory-layout-of-c-program/), which means that its value is first initialized in the `Lock` state and then the modifications are kept between function invocations.

Some of you perhaps say that the `default` and `else` statement can be deleted because there is no other state or event, but never underestimate the power of a well-motivated casting.

This type of implementation is relatively simple to remember just _switch-case the states and if-else the events_ and is the got to pattern when you are in a rush or can't use a 3rd party library.

## Designing the Machine

So, What is the desired interface of a proper Hierarchical State Machine Library? I take the most inspiration from the [Qt State Machine API](https://doc.qt.io/qt-5/statemachine-api.html), as I have mentioned before I'm a fan of the [Qt framework](https://www.qt.io/) and its implementation of most software patterns in C++, and the Hierarchical State Machine is not the exception. My framework takes Qt ideas and implements them with bare-metal restrictions.

There are two main classes the [State Class](https://gitlab.com/ecruzolivera/eHSM/blob/master/Include/State.hpp) and the [Hierarchical State Machine Class](https://gitlab.com/ecruzolivera/eHSM/blob/master/Include/HierarchicalStateMachine.hpp), the first one represent the state, has 2 signals: entered and exited, that are triggered when the state is entered or exited, and also has to virtual methods `onEntered` and `onExited` that can be overridden in a subclass if needed. It also has an overload collection of `addEvent` methods in order to define the behavior of the state for every event that arrives.

In any particular state, an event can trigger an action and/or a transition to another state. In this context, an action is a Delegate with the `void (int)` signature. The state must also be able to hold an internal static allocated list of Events, this list is totally internal to the state machine operation.

The Hierarchical State Machine class must be able to add states, dispatch events, start and stop the event processing. In order to do this, it needs to modify the internal protected state of the states but without breaking the encapsulation. There are two ways to archive this in C++, one is to make the Hierarchical State Machine class a subclass of the state class, this has the inconvenience that the state machine will also have the internal list of events that are completely useless to the state machine and it will consume memory that is precious in any microcontroller application. The other way to archive this is in using the hated but useful `friend` modifier :)

Yes i know, but but, we need to understand that what a lot of peoples thinks that are the "problems" of C++ are also the reason of it's  success, because of it gives you an edge when pushing the performance and the resource utilization to the limit. For a desktop application using protected inheritance in order to access the protected members of a class is the go to solution but this also is the classical [criticism](https://youtu.be/wfMtDGfHWpA?t=151) of inheritance by the functional programming folks.

Another questionable decision was the specification, using the `#define MAX_NEST_DEPTH 16` macro, of the internal state machine "TopState --> ChildState --> ChildChildState" chain up to a total of 16 maximum nested states. This size can be increased by redefining of the macro before the inclusion of the Hierarchical State Machine header. In this case I had another option, that is, the use of a template parameter to specify the size, but this parameter is defaulted to 16 y mean SIXTEEN, if your state machine has more than 16 nested states what in the name of the AI overlord are you designing; and using a template parameter to declare the state machine class with the default parameter is like ugly I guess.

## Simple Turnstile Machine

Let's implement the same machine but with the framework:

```cpp
#include <stdio.h>
#include "../../Include/HierarchicalStateMachine.hpp"

using namespace eHSM;

const int STATE_MAX_EVENTS = 2;

void OnPushedInLocked(int event) {
  printf("Event: %i received\r\n", event);
  printf("Autotransition Locked->Locked\r\n");
}

void OnPushedInUnLocked(int event) {
  printf("Event: %i received\r\n", event);
  printf("Transition UnLocked->Locked\r\n");
}

void OnCoinInsertedInLocked(int event) {
  printf("Event: %i received\r\n", event);
  printf("Transition Locked->UnLocked\r\n");
}

void OnCoinInsertedInUnLocked(int event) {
  printf("Event: %i received\r\n", event);
  printf("Autotransition UnLocked->UnLocked\r\n");
}

int main() {
  enum Events { CoinInserted, BarPushed };
  Declare::State<STATE_MAX_EVENTS> locked;
  Declare::State<STATE_MAX_EVENTS> unlocked;
  // actionHolder is a stack allocated Delegate that will be used to add actions to every events
  State::Action_t actionHolder;

  actionHolder.bind<OnPushedInLocked>();
  locked.addEvent(BarPushed, locked, actionHolder);

  actionHolder.bind<OnCoinInsertedInLocked>();
  locked.addEvent(CoinInserted, unlocked, actionHolder);

  actionHolder.bind<OnCoinInsertedInUnLocked>();
  unlocked.addEvent(CoinInserted, unlocked, actionHolder);

  actionHolder.bind<OnPushedInUnLocked>();
  unlocked.addEvent(BarPushed, locked, actionHolder);

  HierarchicalStateMachine hsm;
  hsm.setInitialState(locked);
  hsm.start();
  hsm.dispatch(BarPushed);
  hsm.dispatch(BarPushed);
  hsm.dispatch(CoinInserted);
  hsm.dispatch(CoinInserted);
  hsm.dispatch(BarPushed);
}

```

This is the console output:

```console
Event: 1 received
Autotransition Locked->Locked
Event: 1 received
Autotransition Locked->Locked
Event: 0 received
Transition Locked->UnLocked
Event: 0 received
Autotransition UnLocked->UnLocked
Event: 1 received
Transition UnLocked->Locked
```

Let's break the example:

First, we have a number of "event handlers" in this case also known as global functions, but because of the `Action_t` type it's really a Delegate of type `void(int)` you can bind global functions or class methods. The event handler receives a parameter that is the event id number that is defined in the `Event` enum,  this enables to use the same event handler for all events in the same state and internally handle each case.

## Hierarchical State Machine

Now I will present an Oven controller example that will be used to show the hierarchical part of the machine. The example was taken from the Wikipedia article about [UML state machines](https://en.wikipedia.org/wiki/UML_state_machine).


![Oven controller state chart Image](/images/UML_state_machine_Oven.png)

This controller uses two top-level states: DoorOpen and Heating, and is a really dumb oven the only way that you can keep it off is by open the door. The Heating state has two substates: Toasting and Baking, the main difference is that the toasting process is at a fixed temperature with a timer, and when baking you can set the temperature value.

The UML design uses the entry/exit handlers as the outputs of the state machine. In this case, I used the state's  `signalEntered` and `signalExited`, I also could sub-class the State class and override the `onExit` and `onEntry` virtual methods.

Here is the code:

```cpp
#include "../../Include/HierarchicalStateMachine.hpp"
#include <stdio.h>

using namespace eHSM;

void InternalLampOn() { printf("InternalLampOn\r\n"); }

void InternalLampOff() { printf("InternalLampOff\r\n"); }

void HeaterOn() { printf("HeaterOn\r\n"); }

void HeaterOff() { printf("HeaterOff\r\n"); }

void ArmAlarm() { printf("Arm toasting alarm\r\n"); }

void DisarmAlarm() { printf("Disarm toasting alarm\r\n"); }

void SetBakingTemperature() { printf("Baking\r\n"); }

void TurnOffBaking() { printf("Not Baking\r\n"); }

int main() {
  enum Events { DoorOpen, DoorClose, DoToasting, DoBaking };
  const int DOOROPEN_STATE_EVENTS = 1;
  const int HEATING_STATE_EVENTS = 3;
  const int TOASTING_STATE_EVENTS = 1;
  const int BAKING_STATE_EVENTS = 1;

  Declare::State<DOOROPEN_STATE_EVENTS> doorOpenState;
  Declare::State<HEATING_STATE_EVENTS> heatingState;
  Declare::State<TOASTING_STATE_EVENTS> toastingState;
  Declare::State<BAKING_STATE_EVENTS> bakingState;
  HierarchicalStateMachine hsm;
  // Connecting Entering and Exiting Signals
  doorOpenState.signalEntered.connect<InternalLampOn>();
  doorOpenState.signalExited.connect<InternalLampOff>();
  doorOpenState.addEvent(DoorClose, heatingState);

  heatingState.signalEntered.connect<HeaterOn>();
  heatingState.signalExited.connect<HeaterOff>();
  heatingState.addEvent(DoorOpen, doorOpenState);
  heatingState.addEvent(DoToasting, toastingState);
  heatingState.addEvent(DoBaking, bakingState);

  toastingState.signalEntered.connect<ArmAlarm>();
  toastingState.signalExited.connect<DisarmAlarm>();
  toastingState.setSuperstate(heatingState);

  bakingState.signalEntered.connect<SetBakingTemperature>();
  bakingState.signalExited.connect<TurnOffBaking>();
  bakingState.setSuperstate(heatingState);

  hsm.setInitialState(heatingState);
  hsm.start();
  hsm.dispatch(DoorOpen);
  hsm.dispatch(DoorClose);
  hsm.dispatch(DoToasting);
  hsm.dispatch(DoorOpen);
  hsm.dispatch(DoorClose);
  hsm.dispatch(DoBaking);
  hsm.dispatch(DoorOpen);
}

```

This is the console output:

```console
HeaterOn
HeaterOff
InternalLampOn
InternalLampOff
HeaterOn
Arm toasting alarm
Disarm toasting alarm
HeaterOff
InternalLampOn
InternalLampOff
HeaterOn
Baking
Not Baking
HeaterOff
InternalLampOn
```

The order of the dispatched events is DoorOpen, DoorClose, DoToasting, DoorOpen, DoorClose, DoBaking and DoorOpen.

Let's analyze the console output vs the dispatch order, the initial state it's **Heating** so when the state machine is started the **Heating** OnEnter signal is triggered which prints "HeaterOn" in the console. Then the DoorOpen event is dispatched triggering the OnExit signal of the Heating state and the onEnter signal from the **DoorOpen** state. The rest of the events follows a similar flow.

1. Initial State: **Heating** State -> OnEnter -> _HeaterOn_
2. Event DoorOpen: **Heating** State -> OnExit -> _HeaterOff_ -> **DoorOpen** State -> OnEnter -> _InternalLampOn_
3. Event DoorClose: **DoorOpen** State -> OnExit -> _InternalLampOff_ -> **Heating** State -> OnEnter -> _HeaterOn_
4. Event DoToasting: **Toasting** State -> OnEnter -> _Arm toasting alarm_
5. Event DoorOpen: **Toasting** State -> OnExit -> _Disarm toasting alarm_ -> **Heating** State -> OnExit -> _HeaterOff_ -> **DoorOpen** State -> OnEnter -> _InternalLampOn_
6. Event DoorClose: **DoorOpen** State -> OnExit -> _InternalLampOff_ -> **Heating** State -> OnEnter -> _HeaterOn_
7. Event DoBaking: **DoBaking** State -> OnEnter -> _Baking_
8. Event DoorOpen: **DoBaking** State -> OnExit -> _Not Baking_ -> **Heating** State -> OnExit -> _HeaterOff_ -> **DoorOpen** State -> OnEnter -> _InternalLampOn_

I really think that the code is clearer.

## Deus Ex Machina (as Conclusions)

Using a library for a state machine implementation is a superior experience when compared with _switch-case_ or _spaghetti-code_ patterns. It has a sort of preamble with the states and states machine instantiations, but it's easy to read, at least when compared with the alternative.

This particular library allows implementation of UML state machines and the hierarchical ones, exposes the OnEnter and OnExit signals to be use as the output of the state machine. It also has the method `State::addEvent` which has 3 overloads:

- `addEvent(EventId_t event, State &nextState, Action_t &action)`
- `addEvent(EventId_t event, State &nextState)`
- `addEvent(EventId_t event, Action_t &action)`

So you can handle an event with a transition with an action, with a transition without an action, and with an action without a transition. This, with the OnEnter and OnExit signals, offers the most flexible options in order to implement the desired functionality in a particular state.

I hope that this will be useful to you dear C++ embedded developer.
