import 'dart:async';
import 'dart:ui';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class HomeMainScreen extends StatefulWidget {
  const HomeMainScreen({Key? key}) : super(key: key);

  final String title = 'Duc Skt';

  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeMainScreen> {
  int seconds = 0, minus = 0, hours = 0;
  String digitSecond = "00", digitMinutes = "00", digitHours = '00';
  Timer? timer;
  bool started = false;
  List laps = [];

  void stop() {
    timer!.cancel();
    setState(() {
      started = false;
    });
  }

  void reset() {
    timer!.cancel();
    setState(() {
      seconds = 0;
      minus = 0;
      hours = 0;

      digitSecond = '00';
      digitMinutes = '00';
      digitHours = '00';
      started = false;
      laps.length = 0;
    });
  }

  void addLaps() {
    String lap = '$digitHours:$digitMinutes:$digitSecond';
    setState(() {
      laps.add(lap);
    });
  }

  void start() {
    setState(() {
      started = true;
    });
    timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      int localSecond = seconds + 1;
      int localMinus = minus;
      int localHours = hours;

      if (localSecond > 59) {
        if (localMinus > 59) {
          localHours++;
          localMinus = 0;
        } else {
          localMinus++;
          localSecond = 0;
        }
      }

      setState(() {
        seconds = localSecond;
        minus = localMinus;
        hours = localHours;
        digitSecond = (seconds >= 10) ? '$seconds' : '0$seconds';
        digitHours = (hours >= 10) ? '$hours' : '0$hours';
        digitMinutes = (minus >= 10) ? '$minus' : '0$minus';
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    print('render');
    return Scaffold(
      backgroundColor: const Color(0xFF1C2757),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              const Center(
                child: Text(
                  "Duc Skt",
                  style: TextStyle(
                      color: Colors.white,
                      fontSize: 28,
                      fontWeight: FontWeight.bold),
                ),
              ),
              const SizedBox(
                height: 30,
              ),
              Center(
                child: Text('$digitHours:$digitMinutes:$digitSecond',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 82,
                      fontWeight: FontWeight.w600,
                    )),
              ),
              Container(
                height: 400,
                decoration: BoxDecoration(
                    color: const Color(0xFF323F68),
                    borderRadius: BorderRadius.circular(8)),
                child: ListView.builder(
                    itemCount: laps.length,
                    itemBuilder: (context, index) {
                      return Padding(
                          padding: const EdgeInsets.all(16),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('Lap n${index + 1}',
                                  style: TextStyle(color: Colors.white)),
                              Text('${laps[index]}',
                                  style: TextStyle(color: Colors.white))
                            ],
                          ));
                    }),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                      flex: 0,
                      child: RawMaterialButton(
                        onPressed: () {
                          (!started) ? start() : stop();
                        },
                        shape: const StadiumBorder(
                            side: BorderSide(color: Colors.blue)),
                        child: Text(
                          (!started) ? 'Start' : 'stop',
                          style: TextStyle(color: Colors.white),
                        ),
                      )),
                  const SizedBox(
                    height: 10,
                  ),
                  Expanded(
                      flex: 0,
                      child: RawMaterialButton(
                        onPressed: () {
                          addLaps();
                        },
                        shape: const StadiumBorder(
                            side: BorderSide(color: Colors.blue)),
                        child: const Text(
                          'addLaps',
                          style: TextStyle(color: Colors.white),
                        ),
                      )),
                  const SizedBox(
                    height: 10,
                  ),
                  Expanded(
                      flex: 0,
                      child: RawMaterialButton(
                        onPressed: () {
                          reset();
                        },
                        shape: const StadiumBorder(
                            side: BorderSide(color: Colors.blue)),
                        child: const Text(
                          'Reset',
                          style: TextStyle(color: Colors.white),
                        ),
                      )),
                ],
              )
            ],
          ),
        ),
      ),
    );
  }
}
