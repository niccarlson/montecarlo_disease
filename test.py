# import string
# output = ""
# alphabet = list(string.ascii_lowercase)
# def solution(x):
# 	global output
# 	global alphabet
# 	for char in x:
# 		if char.isalpha():
# 			if char.isupper():
# 				output += alphabet[alphabet.index(char.lower())].upper()
# 			else:
# 				output += alphabet[25 - alphabet.index(char)]
# 		else:
# 			output += (char)
# 	return output

# print(solution("Yvzs! I xzm'g yvorvev Lzmxv olhg srh qly zg gsv xlolmb!!"))


def solution(s):
    i = 0
    for x in range(len(s)):
        if s[x] == '>':
            i += s[x:len(s)].count('<')
    return 2*i

print(solution('>----<'))

