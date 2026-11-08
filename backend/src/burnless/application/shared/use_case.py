from abc import ABC, abstractmethod


class UseCase[InputT, OutputT](ABC):
    """Um caso de uso = uma intenção do usuário (o S do SOLID).

    As dependências (repositórios, serviços) chegam pelo construtor, sempre
    como interfaces (ports), nunca como implementações concretas.
    """

    @abstractmethod
    async def execute(self, data: InputT) -> OutputT: ...
