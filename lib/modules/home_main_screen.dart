import 'package:flutter/material.dart';
import 'package:flutter_one/components/app_bar.dart';
import 'package:flutter_one/modules/home/duration.dart';

class HomeMainScreen extends StatefulWidget {
  const HomeMainScreen({Key? key}) : super(key: key);

  final String title = 'Duc Skt';

  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeMainScreen> {
  String name = 'duc';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: BaseAppBar(
        title: const Text(
          '3333',
          style: TextStyle(color: Colors.black),
        ),
        appBar: AppBar(),
        widgets: const <Widget>[
          Icon(Icons.more_vert),
        ],
      ),
      body: SingleChildScrollView(
        child: Container(
          color: Colors.amber,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const HomeDuration(title: '2'),
              GestureDetector(
                child: Text('$name'),
                onTap: () {
                  setState(() {
                    name = '4444';
                  });
                },
              )
            ],
          ),
        ),
      ),
    );
  }
}
