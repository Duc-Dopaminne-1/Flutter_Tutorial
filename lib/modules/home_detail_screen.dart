import 'package:flutter/material.dart';
import 'package:flutter_one/components/app_bar.dart';
import 'package:flutter_one/modules/home/duration.dart';

class HomeDetailScreen extends StatefulWidget {
  final String title;
  const HomeDetailScreen({Key? key, required this.title}) : super(key: key);

  @override
  _HomeDetailScreenState createState() => _HomeDetailScreenState();
}

class _HomeDetailScreenState extends State<HomeDetailScreen> {
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
