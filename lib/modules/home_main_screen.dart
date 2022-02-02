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
  String? name;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: BaseAppBar(
        title: Text(
          name ?? "sd",
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
                child: Text(name ?? "1111"),
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
