// Log'n Pass
//
//	01/03/2015, pprem : création du fichier

// lognpass_get_password : generate a password
//		phrase_md5 => the md5 crypted user's lognpass phrase
//		api_key, api_num => parameters from api.lognpass.com/get
//		return the password
function lognpass_get_password(phrase_md5,api_key,api_num)
{
	pass = '';
	md5 = $.md5(phrase_md5+api_key);
	for (i = 0; i < md5.length; i++)
	{
		c = md5.charAt(i);
		if (('0' <= c) && (c <= '9'))
		{
			pass = pass+c;
		}
	}
	i = 0;
	while (pass.length < 5)
	{
		pass = pass+i.toString();
		i++;
	}
	if (pass.length > 9)
	{
		pass = pass.substr(0,9);
	}
	return pass.length.toString()+pass+api_num.toString();
}

// lognpass_check_password : check a password
//		phrase_md5 => the md5 crypted user's lognpass phrase
//		password => the password to check
//		call success() function if succeed
//		call fail() function if failed
var lognpass_previous_password = [];
function lognpass_check_password(phrase_md5,password,success,fail)
{
	password_ok = false;
	nb = parseInt(password.charAt(0));
	api_num = password.substr(nb+1);
	$.getJSON('http://'+api_num+'.lognpass.net/get/', function(data, statut, xhr) {
		if ('success' == statut)
		{
			if (lognpass_get_password(phrase_md5,data.key,data.num) == password)
			{
				password_ok = true;
				num = lognpass_previous_password.length;
				for (i=0; i < lognpass_previous_password.length; i++)
				{
					if (lognpass_previous_password[i].indexOf(phrase_md5) > -1)
					{
						num = i;
						password_ok = (lognpass_previous_password[i] != phrase_md5+'!'+password);
					}
				}
				lognpass_previous_password[num] = phrase_md5+'!'+password;
			}
		}
		if (password_ok)
		{
			success();
		}
		else
		{
			fail();
		}
	});
}