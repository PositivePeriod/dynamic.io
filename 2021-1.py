a = """
19-005
19-006
19-017
19-028
19-040
19-057
19-058
19-062
19-079
19-108
19-110
19-121
19-123
19-124
20-009
20-011
20-017
20-046
20-061
20-065
20-096
20-109
20-120
20-209
20-210
21-001
21-005
21-014
21-017
21-020
21-024
21-035
21-046
21-050
21-054
21-070
21-079
21-086
21-124
21-203
"""
b = """
19-006
19-017
19-023
19-026
19-028
19-030
19-035
19-037
19-040
19-042
19-057
19-058
19-068
19-076
19-079
19-086
19-089
19-122
19-124
20-001
20-006
20-011
20-017
20-035
20-061
20-069
20-109
20-120
20-210
21-017
21-024
21-079
"""

a = a.split()
b = b.split()
c = []
for line in a:
    if line in b:
        c.push(line)