class District {
  final String id;
  final String name;
  final String state;
  final String code;

  const District({
    required this.id,
    required this.name,
    required this.state,
    required this.code,
  });

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is District &&
          runtimeType == other.runtimeType &&
          id == other.id;

  @override
  int get hashCode => id.hashCode;
}
