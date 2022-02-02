import 'package:flutter/material.dart';

class HomeDetailScreen extends StatefulWidget {
  final String title;
  const HomeDetailScreen({Key? key, required this.title}) : super(key: key);

  @override
  _HomeDetailScreenState createState() => _HomeDetailScreenState();
}

class _HomeDetailScreenState extends State<HomeDetailScreen> {
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    print('duc dep: ' + widget.title);
  }

  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
