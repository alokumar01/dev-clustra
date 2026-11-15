resource "aws_instance" "devclustra_server" {

  ami = "ami-0f918f7e67a3323f0"

  instance_type = var.instance_type

  vpc_security_group_ids = [aws_security_group.devclustra_sg.id]

  key_name = "devclustra-key"

  tags = {
    Name = var.instance_name
  }

}


resource "aws_eip" "devclustra_eip" {

  instance = aws_instance.devclustra_server.id

  domain = "vpc"

  tags = {
    Name = "devclustra-elastic-ip"
  }

}


resource "aws_security_group" "devclustra_sg" {

  name = "devclustra-security-group"

  ingress {

    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]

  }

  ingress {

    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]

  }

  ingress {

    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]

  }

  egress {

    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]

  }

  tags = {
    Name = "devclustra-security-group"
  }

}
