output "instance_public_ip" {
  value = aws_eip.devclustra_eip.public_ip
}

output "instance_id" {
  value = aws_instance.devclustra_server.id
}
